import { useEffect, useLayoutEffect, useState } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, getSellQuantity, handleTransaction } from "./utils/functions";
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
  const [nextCustomer, setNextCustomer] = useState<string>(getRandomEmoji());
  const [animatingEmojis, setAnimatingEmojis] = useState<
    { emoji: string; id: number; offset: string }[]
  >([]);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const { handleSell } = useCustomerManagement(userInfo, setUserInfo);
  const [isSupplierModalOpen, setIsSupplierModalOpen] =
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleOpenSupplierModal = () => {
    setIsSupplierModalOpen(true);
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

  const getRandomOffset = () => {
    return `${Math.floor(Math.random() * 41) - 20}px`;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    let result = false;
    const slottedProducts = userInfo.products.filter((p) => p.slot !== null);
    const slottedProductToSell = slottedProducts.find(
      (p) => p.name === selectedProduct
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
        marketInfo
      );
      setLastTransaction(transaction);

      newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: transaction?.amountEarned || 0,
      };

      addToBatch(selectedProduct);

      // Move the customer emoji to the animating array
      setNextCustomer(getRandomEmoji());
      const newAnimatingEmoji = {
        emoji: nextCustomer,
        id: Date.now(),
        offset: getRandomOffset(),
      };
      setAnimatingEmojis((prev) => [...prev, newAnimatingEmoji]);

      setTimeout(() => {
        setAnimatingEmojis((prev) =>
          prev.filter((emoji) => emoji.id !== newAnimatingEmoji.id)
        );
      }, 1000);

      setUserInfo((prevUser) => {
        const customerAmount =
          prevUser.customerAmount - 1 < 0 ? 0 : prevUser.customerAmount - 1;
        const customerAmountRemaining =
          prevUser.customerAmountRemaining - 1 < 0
            ? 0
            : prevUser.customerAmountRemaining - 1;
        return {
          ...prevUser,
          customerAmount,
          customerAmountRemaining,
          cashAmount: cashState,
          products: updatedProducts,
        };
      });
      result = true;
    }
    setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
    WebApp.HapticFeedback.impactOccurred("heavy");
    setTimeout(() => {
      setTouchPoints((prevTouchPoints) =>
        prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
      );
    }, 3000);
    return result;
  };

  return (
    <HomeContainer>
      <ClickableAreaWithSmoke
        products={userInfo.products}
        handleTouchStart={handleTouchStart}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        handleOpenSupplierModal={handleOpenSupplierModal}
        customer={nextCustomer}
        customerAmount={userInfo.customerAmount}
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
