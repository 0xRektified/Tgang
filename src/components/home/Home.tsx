import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import {
  calculateTotalQuantity,
  getSellQuantity,
  handleTransaction,
} from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { IUserInfo } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { IMarketInfo } from "../interfaces/market.interface";
import styled from "styled-components";
import useCustomerManagement from "../../hooks/useCustomerManagement";
import { useBatchSell } from "../../hooks/useBatchSell";
import { EProduct } from "../interfaces/product.interface";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { CombinedModal } from "./CombinedModal";
import { getRandomEmoji } from "./HomeBoard";
import { useTutorial } from "../../hooks/useTutorial";

const formatNumber = (num: number) => num.toFixed(2);

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80vh;
  touch-action: none;
  position: relative;
  overflow: hidden;
`;

export const SkipButton = styled.button`
  background: grey;
  color: black;
  border-radius: 6px;
  padding: 0.6em 1em;
  font-size: 0.7em !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.8rem auto;
  width: 10em;
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(116, 185, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0);
    }
  }
  @media (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em 0.8em;
  }
  display: block;
`;

interface HomeProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  onUnlockClick: (tab?: string | undefined) => void;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  signup: boolean;
  tutorial: ReturnType<typeof useTutorial>;
  handleTutorialComplete: () => void;
  isCombinedModalOpen: boolean;
  closeCombinedModal: () => void;
  isContentLoaded: boolean; // Add this line
}

export const Home: React.FC<HomeProps> = ({
  userInfo: initialUserInfo,
  marketInfo,
  setUserInfo: setGlobalUserInfo,
  onUnlockClick,
  shippingMethods,
  signup,
  tutorial,
  handleTutorialComplete,
  isCombinedModalOpen,
  closeCombinedModal,
  isContentLoaded, // Add this line
}) => {
  const { userInfo, setUserInfo, decreaseCustomer, handleSell } =
    useCustomerManagement(initialUserInfo);

  useEffect(() => {
    if (initialUserInfo && initialUserInfo.username && JSON.stringify(initialUserInfo) !== JSON.stringify(userInfo)) {
      setUserInfo(initialUserInfo);
    }
  }, [initialUserInfo]);

  useEffect(() => {
    if (JSON.stringify(userInfo) !== JSON.stringify(initialUserInfo)) {
      setGlobalUserInfo(userInfo);
    }
  }, [userInfo, setGlobalUserInfo, initialUserInfo]);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>(EProduct.HERB);
  const [nextCustomer, setNextCustomer] = useState<string>(getRandomEmoji());
  const [animatingEmojis, setAnimatingEmojis] = useState<
    { emoji: string; id: number; offset: string }[]
  >([]);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [isLocalSupplierModalOpen, setIsLocalSupplierModalOpen] =
    useState<boolean>(false);

  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null,
  );

  const { addToBatch } = useBatchSell(
    marketInfo?.id || "", // Pass marketId here
    handleSell,
  );

  useEffect(() => {
    const value = calculateTotalQuantity(userInfo.products);
    setTotalQuantity(value);
  }, [userInfo.products]);

  const handleCloseSupplierModal = () => {
    setIsLocalSupplierModalOpen(false);
    closeCombinedModal();
    if (!tutorial.tutorialCompleted) {
      tutorial.setTutorialCompleted(true);
      tutorial.tutorialCompleted = true;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleOpenSupplierModal = () => {
    if (tutorial.tutorialStep === 2) {
      setSelectedProduct(EProduct.HERB);
    }
    setIsLocalSupplierModalOpen(true);
  };

  const getRandomOffset = () => {
    return `${Math.floor(Math.random() * 41) - 20}px`;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    let result = false;
    const slottedProducts = userInfo.products.filter((p) => p.slot !== null);
    const slottedProductToSell = slottedProducts.find(
      (p) => p.name === selectedProduct,
    );

    let newTouchPoint = {
      id: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
      amountEarned: 0,
    };

    const sellQuantity = getSellQuantity(userInfo, slottedProductToSell!.name);

    if (
      userInfo.customerAmount === 0 ||
      !slottedProductToSell ||
      slottedProductToSell.quantity < sellQuantity
    ) {
      setLastTransaction({
        type: "missed",
        product: selectedProduct || "Unknown",
        quantity: sellQuantity,
      });
    } else {
      const { updatedProducts, transaction, cashState } = handleTransaction(
        userInfo,
        slottedProductToSell,
        marketInfo,
      );
      setLastTransaction(transaction);

      newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: transaction?.amountEarned
          ? Number(formatNumber(transaction.amountEarned))
          : 0,
      };

      addToBatch(selectedProduct);
      decreaseCustomer();

      setUserInfo((prevUser) => ({
        ...prevUser,
        cashAmount: Number(formatNumber(cashState)),
        reputation: prevUser.reputation + sellQuantity,
        products: updatedProducts,
      }));

      setNextCustomer(getRandomEmoji());
      const newAnimatingEmoji = {
        emoji: nextCustomer,
        id: Date.now(),
        offset: getRandomOffset(),
      };
      setAnimatingEmojis((prev) => [...prev, newAnimatingEmoji]);

      setTimeout(() => {
        setAnimatingEmojis((prev) =>
          prev.filter((emoji) => emoji.id !== newAnimatingEmoji.id),
        );
      }, 1000);

      result = true;
    }
    setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
    WebApp.HapticFeedback.impactOccurred("heavy");
    setTimeout(() => {
      setTouchPoints((prevTouchPoints) =>
        prevTouchPoints.filter((point) => point.id !== newTouchPoint.id),
      );
    }, 3000);
    return result;
  };

  const [activeTab, setActiveTab] = useState<"TilkRoad" | "Tedex">("TilkRoad");

  const handleOpenModal = (tab: "TilkRoad" | "Tedex") => {
    WebApp.HapticFeedback.impactOccurred("heavy");

    setActiveTab(tab);
    setIsLocalSupplierModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <HomeContainer>
      <ClickableAreaWithSmoke
        products={userInfo.products}
        handleTouchStart={handleTouchStart}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        customer={nextCustomer}
        customerAmount={userInfo.customerAmount}
        customerAmountMax={userInfo.customerAmountMax}
        animatingEmojis={animatingEmojis}
        marketInfo={marketInfo}
        signup={signup}
        tutorial={tutorial}
        handleOpenTilkRoadModal={() => handleOpenModal("TilkRoad")}
        handleOpenTedexModal={() => handleOpenModal("Tedex")}
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          visibility: isContentLoaded ? 'visible' : 'hidden'
        }}
      />

      <TouchPoints
        touchPoints={touchPoints}
        lastTransaction={lastTransaction}
      />
      {(isLocalSupplierModalOpen || isCombinedModalOpen) && (
        <CombinedModal
          userInfo={userInfo}
          marketInfo={marketInfo}
          isOpen={isLocalSupplierModalOpen || isCombinedModalOpen}
          onClose={handleCloseSupplierModal}
          onUnlockClick={onUnlockClick}
          setUserInfo={setUserInfo}
          shippingMethods={shippingMethods}
          tutorial={tutorial}
          handleTutorialComplete={handleTutorialComplete}
          initialTab={activeTab}
        />
      )}
    </HomeContainer>
  );
};
