import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import {
  CloseButton,
  FixedOverlay,
  ModalContainer,
  Notch,
  RoundButton,
  TabContainer,
  Tab,
} from "./styles/supplier.css";
import { tabMapping } from "../interfaces/general.interface";
import useBuyProduct from "../../hooks/useBuyProduct";
import useShipProduct from "../../hooks/useShipProduct";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProduct } from "../interfaces/product.interface";
import { TilkRoadModal } from "./TilkRoadModal";
import { TedexModal } from "./TedexModal";

interface ModalProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUnlockClick: (tab: string) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const CombinedModal: React.FC<ModalProps> = ({
  userInfo,
  marketInfo,
  isOpen,
  onClose,
  onUnlockClick,
  setUserInfo,
}) => {
  const [activeTab, setActiveTab] = useState("Tilk Road");
  const { buyProduct, loading, error } = useBuyProduct();
  const { shipProduct } = useShipProduct();
  const [selectedProduct, setSelectedProduct] = useState<
    Product | MarketProduct | null
  >(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [remainingCash, setRemainingCash] = useState<number>(
    userInfo.cashAmount
  );

  const [batch, setBatch] = useState<
    { product: EProduct; amountToSell: number }[]
  >([]);

  useEffect(() => {
    setTotalCost(
      selectedProduct && "discountPrice" in selectedProduct
        ? selectedProduct.discountPrice * quantity
        : 0
    );
    setRemainingCash(
      userInfo.cashAmount -
        (selectedProduct && "discountPrice" in selectedProduct
          ? selectedProduct.discountPrice * quantity
          : 0)
    );
  }, [selectedProduct, quantity, userInfo]);

  const handleBuy = async () => {
    if (totalCost > userInfo.cashAmount) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    if (selectedProduct && "discountPrice" in selectedProduct) {
      await buyProduct("NY", selectedProduct.name, quantity, setUserInfo);
    }
    setSelectedProduct(null);
    setQuantity(1);
    WebApp.HapticFeedback.impactOccurred("heavy");
  };

  const handleProductSelect = (product: Product | MarketProduct) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setSelectedProduct((prevSelectedProduct) =>
      prevSelectedProduct?.name === product.name ? null : product
    );
    setQuantity(1);
  };

  const handleUnlockClick = (product: MarketProduct) => {
    onUnlockClick(tabMapping[product.name]);
    onClose();
  };

  const handleShip = () => {
    shipProduct("NY", batch, setUserInfo);
  };

  if (!isOpen) return null;
  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Notch />
        <TabContainer>
          <Tab
            active={activeTab === "Tilk Road"}
            onClick={() => setActiveTab("Tilk Road")}
          >
            Tilk Road
          </Tab>
          <Tab
            active={activeTab === "Tedex"}
            onClick={() => setActiveTab("Tedex")}
          >
            Tedex
          </Tab>
        </TabContainer>

        {activeTab === "Tilk Road" && (
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
          ></TilkRoadModal>
        )}

        {activeTab === "Tedex" && (
          <TedexModal
            userInfo={userInfo}
            selectedProduct={selectedProduct}
            quantity={quantity}
            batch={batch}
            handleShip={handleShip}
            setQuantity={setQuantity}
            handleProductSelect={handleProductSelect}
            setBatch={setBatch}
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
