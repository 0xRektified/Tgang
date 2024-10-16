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
import { ApiToast } from "../ApiToast";

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
  const {
    buyProduct,
    loading: buyLoading,
    error: buyError,
    successMessage: buySuccess,
  } = useBuyProduct();
  const {
    shipProduct,
    loading: shipLoading,
    error: shipError,
    successMessage: shipSuccess,
  } = useShipProduct();
  const [selectedProduct, setSelectedProduct] = useState<
    Product | MarketProduct | null
  >(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [remainingCash, setRemainingCash] = useState<number>(
    userInfo.cashAmount,
  );

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
    );
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

        <ApiToast
          loading={buyLoading || shipLoading}
          error={buyError || shipError}
          successMessage={buySuccess || shipSuccess}
        />

        <CloseButton onClick={onClose}>&times;</CloseButton>
        <RoundButton onClick={onClose}>&times;</RoundButton>
      </ModalContainer>
    </FixedOverlay>
  );
};
