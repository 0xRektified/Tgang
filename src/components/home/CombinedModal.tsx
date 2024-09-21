import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import {
  CloseButton,
  FixedOverlay,
  ModalContainer,
  Notch,
  RoundButton,
} from "./styles/supplier.css";
import { tabMapping } from "../interfaces/general.interface";
import useBuyProduct from "../../hooks/useBuyProduct";
import useShipProduct from "../../hooks/useShipProduct";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProduct } from "../interfaces/product.interface";
import { TilkRoadModal } from "./TilkRoadModal";
import { TedexModal } from "./TedexModal";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { useTutorial } from "../../hooks/useTutorial";

interface ModalProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUnlockClick: (tab?: string | undefined) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  tutorial: ReturnType<typeof useTutorial>;
  handleTutorialComplete: () => void;
  initialTab: "TilkRoad" | "Tedex";
}

export const CombinedModal: React.FC<ModalProps> = ({
  userInfo,
  marketInfo,
  isOpen,
  onClose,
  onUnlockClick,
  setUserInfo,
  shippingMethods,
  tutorial,
  handleTutorialComplete,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { buyProduct, loading, error } = useBuyProduct();
  const { shipProduct } = useShipProduct();
  const [selectedProduct, setSelectedProduct] = useState<
    Product | MarketProduct | null
  >(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [remainingCash, setRemainingCash] = useState<number>(
    userInfo.cashAmount,
  );
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  useEffect(() => {
    if (selectedProduct && "discountPrice" in selectedProduct) {
      const newTotalCost = selectedProduct.discountPrice * quantity;
      setTotalCost(newTotalCost);
    } else {
      setTotalCost(0);
    }
    setRemainingCash(userInfo.cashAmount);
  }, [selectedProduct, quantity, userInfo.cashAmount]);

  const handleBuy = async () => {
    if (totalCost > userInfo.cashAmount) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    if (selectedProduct && "discountPrice" in selectedProduct) {
      await buyProduct("NY", selectedProduct.name, quantity, setUserInfo);

      if (
        tutorial.tutorialStep === 2 &&
        selectedProduct.name === EProduct.HERB
      ) {
        tutorial.onTutorialProgress();
        handleTutorialComplete();
      }
    }
    setSelectedProduct(null);
    setQuantity(1);
    WebApp.HapticFeedback.impactOccurred("heavy");
  };

  const handleProductSelect = (product: Product | MarketProduct) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    if (tutorial.tutorialStep === 2 && product.name !== EProduct.HERB) {
      return;
    }
    setSelectedProduct((prevSelectedProduct) =>
      prevSelectedProduct?.name === product.name ? null : product,
    );
    setQuantity(tutorial.tutorialStep === 2 ? 5 : 1);
  };

  const handleUnlockClick = (product: MarketProduct | undefined) => {
    if (product) {
      onUnlockClick(tabMapping[product.name]);
    } else {
      onUnlockClick("shipping");
    }
    onClose();
  };

  const handleRedirectToTilkRoad = () => {
    setActiveTab("TilkRoad");
  };

  const handleShip = (
    shippingMethod: EShippingMethod,
    product: EProduct,
    amount: number,
  ) => {
    shipProduct(
      "NY",
      {
        shippingMethod,
        product,
        amount,
      },
      setUserInfo,
    ); // TODO
  };

  if (!isOpen) return null;
  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Notch />

        {activeTab === "TilkRoad" && (
          <TilkRoadModal
            remainingCash={remainingCash}
            totalCost={totalCost}
            marketInfo={marketInfo}
            userInfo={userInfo}
            selectedProduct={selectedProduct}
            quantity={quantity}
            handleBuy={handleBuy}
            setQuantity={setQuantity}
            handleProductSelect={handleProductSelect}
            handleUnlockClick={handleUnlockClick}
            setSelectedProduct={setSelectedProduct}
            tutorial={tutorial}
          ></TilkRoadModal>
        )}

        {activeTab === "Tedex" && (
          <TedexModal
            userInfo={userInfo}
            handleShip={handleShip}
            shippingMethods={shippingMethods}
            handleRedirectToTilkRoad={handleRedirectToTilkRoad}
            handleUnlockClick={handleUnlockClick}
          ></TedexModal>
        )}

        <CloseButton onClick={onClose}>&times;</CloseButton>
        <RoundButton onClick={onClose}>&times;</RoundButton>
        {showToast && (
          <div className="fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right">
            <div className="toast toast-top toast-end">
              <div className="alert alert-error p-4 rounded shadow-lg text-white bg-red-600 font-bold">
                <span>{error ? error : `Not enough cash.`}</span>
              </div>
            </div>
          </div>
        )}
      </ModalContainer>
    </FixedOverlay>
  );
};
