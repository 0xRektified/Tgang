import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { CustomersBoard, getRandomEmoji } from "./CustomersBoard";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { marketId } from "../../mocks/backend.mock";
import { IMarketInfo } from "../interfaces/market.interface";
import { getUnixTime } from "date-fns";
import { EDealerUpgrade } from "../interfaces/upgrade.interface";
import styled from "styled-components";
import useCustomerManagement from "../../hooks/useCustomerManagement";
import { useBatchSell } from "../../hooks/useBatchSell";
import { EProduct } from "../interfaces/product.interface";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

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
  const [selectedProduct, setSelectedProduct] = useState<string>(EProduct.WEED);

  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const { customers, setCustomers, handleSell } = useCustomerManagement(
    userInfo,
    setUserInfo
  );

  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );

  const { addToBatch } = useBatchSell(
    marketInfo?.id || "", // Pass marketId here
    handleSell // Pass handleSell to synchronize customer count after selling
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
      // @note TODO update that with the value in upgrade customer needs
      const amountToSell = 1;

      const slottedProductToSell = slottedProducts.find(
        (p) => p.name === selectedProduct
      );

      let newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: 0,
      };

      if (
        !slottedProductToSell ||
        slottedProductToSell.quantity < amountToSell
      ) {
        setLastTransaction({
          type: "missed",
          product: selectedProduct || "Unknown",
          quantity: amountToSell,
        });
      } else {
        const { updatedProducts, transaction, cashState } = handleTransaction(
          userInfo,
          slottedProducts,
          selectedProduct,
          amountToSell,
          marketInfo
        );
        setLastTransaction(transaction);

        newTouchPoint = {
          id: Date.now(),
          x: touch.clientX,
          y: touch.clientY,
          amountEarned: transaction?.amountEarned || 0,
        };

        addToBatch(selectedProduct, amountToSell);
        setCustomers((prevCustomers) => prevCustomers.slice(1));
        setUserInfo((prevUser) => ({
          ...prevUser,
          cashAmount: cashState,
          products: updatedProducts,
        }));
      }
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

  return (
    <HomeContainer>
      <ClickableAreaWithSmoke
        products={userInfo.products}
        handleTouchStart={handleTouchStart}
        pressed={pressed}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      <CustomersBoard customers={customers} transaction={lastTransaction} />
      <TouchPoints touchPoints={touchPoints} />
      {isModalOpen && (
        <InventoryModal
          selectedSlot={selectedSlot}
          productsData={userInfo.products}
          handleSelectProductFromInventory={handleSelectProductFromInventory}
          handleCloseModal={handleCloseModal}
        />
      )}
    </HomeContainer>
  );
};
