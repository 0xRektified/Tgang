import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { CustomersBoard, getRandomEmoji } from "./CustomersBoard";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { marketId } from "../../mocks/backend.mock";
import useBatchSell from "../../hooks/useBatchSell";
import { IMarketInfo } from "../interfaces/market.interface";
import { getUnixTime } from "date-fns";
import { EDealerUpgrade } from "../interfaces/upgrade.interface";

interface HomeProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const Home: React.FC<HomeProps> = ({
  userInfo,
  marketInfo,
  setUserInfo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [customers, setCustomers] = useState<string[]>(() => {
    const initialCustomers = Math.max(0, userInfo.customerAmount);
    return Array(initialCustomers)
      .fill(null)
      .map(() => getRandomEmoji());
  });

  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );
  const { addToBatch, loading, error } = useBatchSell(
    marketId,
    setUserInfo,
    setCustomers
  );
  useLayoutEffect(() => {
    const scrollableEl = document.getElementById("mainView");
    if (scrollableEl) {
      scrollableEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const value = calculateTotalQuantity(userInfo.products);
    setTotalQuantity(value);
  }, [userInfo.products]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCustomerAmount = calculateCustomers();
      setUserInfo((prevUser) => ({
        ...prevUser,
        customerAmount: updatedCustomerAmount,
      }));
      setCustomers((prevCustomers) => {
        const newCustomerCount = updatedCustomerAmount - prevCustomers.length;
        if (newCustomerCount > 0) {
          const newCustomers = Array(newCustomerCount)
            .fill(null)
            .map(() => getRandomEmoji());
          return [...prevCustomers, ...newCustomers];
        }
        return prevCustomers;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userInfo.lastSell, userInfo.upgrades, userInfo.customerAmountRemaining]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleSelectProductFromInventory = (product: {
    id: number;
    name: string;
    quantity: number;
  }) => {
    if (selectedSlot === null) return;

    setUserInfo((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedProducts = prevUser.products.map((p) =>
        p.name === product.name
          ? { ...p, slot: selectedSlot }
          : p.slot === selectedSlot
          ? { ...p, slot: null }
          : p
      );

      return {
        ...prevUser,
        products: updatedProducts,
      };
    });

    setIsModalOpen(false);
  };

  const playSound = (() => {
    let lastPlayTime = 0;
    let concurrentSounds = 0;
    const maxConcurrentSounds = 3;
    const minInterval = 200;

    return () => {
      const now = Date.now();
      if (
        concurrentSounds < maxConcurrentSounds &&
        now - lastPlayTime > minInterval
      ) {
        concurrentSounds++;
        lastPlayTime = now;
        const audio = new Audio("/assets/cash.mp3");
        audio.play();
        audio.onended = () => {
          concurrentSounds--;
        };
      }
    };
  })();

  const handleTouchStart = async (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    const slottedProducts = userInfo.products.filter((p) => p.slot !== null);

    if (userInfo.customerAmount) {
      // @note TODO update that with a selector in the FE to know which product to sell
      const product = "Weed";
      // @note TODO update that with the value in upgrade customer needs
      const amountToSell = 1;

      const slottedProductToSell = slottedProducts.find(
        (p) => p.name === product
      );

      let newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: 0,
      };

      let _updatedProducts: Product[] = [];
      let _cashState: number = userInfo.cashAmount;
      if (
        !slottedProductToSell ||
        slottedProductToSell.quantity < amountToSell
      ) {
        setLastTransaction({
          type: "missed",
          product: product || "Unknown",
          quantity: amountToSell,
        });
      } else {
        const { updatedProducts, transaction, cashState } = handleTransaction(
          userInfo,
          slottedProducts,
          product,
          amountToSell,
          marketInfo
        );
        _updatedProducts = updatedProducts;
        _cashState = cashState;
        setLastTransaction(transaction);

        newTouchPoint = {
          id: Date.now(),
          x: touch.clientX,
          y: touch.clientY,
          amountEarned: transaction?.amountEarned || 0,
        };

        addToBatch(product, amountToSell);
      }

      setUserInfo((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          products:
            _updatedProducts.length > 0 ? _updatedProducts : prevUser.products,
          customerAmount: prevUser.customerAmount - 1,
          cashAmount: _cashState,
        };
      });

      setCustomers((prevCustomers) => prevCustomers.slice(1));

      setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
      setPressed(true);

      if (newTouchPoint.amountEarned) {
        playSound();
      }
      WebApp.HapticFeedback.impactOccurred("heavy");
      setTimeout(() => setPressed(false), 50);
      setTimeout(() => {
        setTouchPoints((prevTouchPoints) =>
          prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
        );
      }, 3000);
    }
  };

  const calculateCustomers = () => {
    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    const serverTime = getUnixTime(new Date(userInfo.lastSell));
    const feTime = getUnixTime(nowUTC);
    const diff = feTime - serverTime;
    const customerAmountUpgrade = userInfo.upgrades.find(
      (e) => e.id === EDealerUpgrade.CUSTOMER_AMOUNT
    );
    if (!customerAmountUpgrade) {
      return 0;
    }
    const customerAmountMax =
      customerAmountUpgrade.value[customerAmountUpgrade.level];
    let newCustomers = 0;

    if (diff > 3600) {
      newCustomers = Math.floor(customerAmountMax);
    } else {
      newCustomers = Math.floor((diff / 3600) * customerAmountMax);
    }
    return Math.min(
      userInfo.customerAmountRemaining + newCustomers,
      customerAmountMax
    );
  };

  return (
    <>
      <ClickableAreaWithSmoke
        products={userInfo.products}
        handleTouchStart={handleTouchStart}
        pressed={pressed}
      />
      <div className="bg-zinc-800 text-white px-4 rounded shadow-lg">
        <CustomersBoard customers={customers} transaction={lastTransaction} />
      </div>
      <TouchPoints touchPoints={touchPoints} />
      {isModalOpen && (
        <InventoryModal
          selectedSlot={selectedSlot}
          productsData={userInfo.products}
          handleSelectProductFromInventory={handleSelectProductFromInventory}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};
