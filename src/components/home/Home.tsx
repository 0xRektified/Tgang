import { useEffect, useLayoutEffect, useState } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { IMarketInfo } from "../interfaces/market.interface";
import { EDealerUpgrade } from "../interfaces/upgrade.interface";
import styled from "styled-components";
import useCustomerManagement from "../../hooks/useCustomerManagement";
import { useBatchSell } from "../../hooks/useBatchSell";
import { EProduct } from "../interfaces/product.interface";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { CombinedModal } from "./CombinedModal";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  min-height: 80vh;
  height: auto;
`;

interface HomeProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  onUnlockClick: (tab: string) => void;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
}

export const Home: React.FC<HomeProps> = ({
  userInfo,
  marketInfo,
  setUserInfo,
  onUnlockClick,
  shippingMethods,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>(EProduct.WEED);
  const [animatingEmojis, setAnimatingEmojis] = useState<
    { emoji: string; id: number; offset: string }[]
  >([]);
  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const { customers, setCustomers, handleSell } = useCustomerManagement(
    userInfo,
    setUserInfo
  );
  const [isSupplierModalOpen, setIsSupplierModalOpen] =
    useState<boolean>(false);
  const [isShippinhModalOpen, setIsShippinhModalOpen] =
    useState<boolean>(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );

  const { addToBatch } = useBatchSell(
    marketInfo?.id || "", // Pass marketId here
    handleSell
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

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  const handleCloseShippingModal = () => {
    setIsShippinhModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleOpenSupplierModal = () => {
    setIsSupplierModalOpen(true);
  };

  const handleOpenShippingModal = () => {
    setIsShippinhModalOpen(true);
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

  const getRandomOffset = () => {
    return `${Math.floor(Math.random() * 41) - 20}px`;
  };

  const handleTouchStart = async (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    const slottedProducts = userInfo.products.filter((p) => p.slot !== null);
    if (userInfo.customerAmount) {
      const amountToSell = userInfo.customerNeeds;

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

        // Move the customer emoji to the animating array
        const nextCustomer = customers[0];
        const newAnimatingEmoji = {
          emoji: nextCustomer,
          id: Date.now(),
          offset: getRandomOffset(),
        };
        setAnimatingEmojis((prev) => [...prev, newAnimatingEmoji]);
        setCustomers((prevCustomers) => prevCustomers.slice(1));

        setTimeout(() => {
          setAnimatingEmojis((prev) =>
            prev.filter((emoji) => emoji.id !== newAnimatingEmoji.id)
          );
        }, 1000);

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
        handleOpenSupplierModal={handleOpenSupplierModal}
        handleOpenShippingModal={handleOpenShippingModal}
        customers={customers}
        transaction={lastTransaction}
        animatingEmojis={animatingEmojis}
        marketInfo={marketInfo}
      />

      <TouchPoints touchPoints={touchPoints} />
      {isModalOpen && (
        <InventoryModal
          selectedSlot={selectedSlot}
          productsData={userInfo.products}
          handleSelectProductFromInventory={handleSelectProductFromInventory}
          handleCloseModal={handleCloseModal}
        />
      )}
      {isSupplierModalOpen && (
        <CombinedModal
          userInfo={userInfo}
          marketInfo={marketInfo}
          isOpen={isSupplierModalOpen}
          onClose={handleCloseSupplierModal}
          onUnlockClick={onUnlockClick}
          setUserInfo={setUserInfo}
          shippingMethods={shippingMethods}
        />
      )}
    </HomeContainer>
  );
};
