import React, { useState } from "react";
import { supplierPrice } from "../../../mocks/backend.mock";
import WebApp from "@twa-dev/sdk";
import {
  BottomSection,
  ButtonContainer,
  CloseButton,
  FixedOverlay,
  ModalContainer,
  QuantityInputContainer,
  ScrollableTableContainer,
  StyledButton,
  StyledInput,
  Table,
} from "../styles/supplier.css";
import { Upgrades } from "../../shop/utils/types";
import { tabMapping } from "../../interfaces/general.interface";
import useBuyProduct from "../../../hooks/useBuyProduct";
import { Product } from "../../interfaces/user.interface";
import { useMarketData } from "../../../hooks/useMarketData";
import { useAuthAndFetchUserData } from "../../../hooks/useAuthAndFetchUserData";
import { MarketProduct } from "../../interfaces/market.interface";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  onUnlockClick: (tab: keyof Upgrades) => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
  cashAmount,
  setCashAmount,
  onUnlockClick,
}) => {
  const { buyProduct, loading, error } = useBuyProduct();
  const { marketInfo } = useMarketData();
  const { userInfo } = useAuthAndFetchUserData();
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleBuy = async () => {
    if (!selectedProduct) return;
    const cost =
      supplierPrice[selectedProduct.name as keyof typeof supplierPrice] *
      quantity;
    if (cashAmount >= cost) {
      await buyProduct(
        "NY", //@note remove that and handle it dynamically
        selectedProduct.name,
        quantity,
        setCashAmount,
        setProducts
      );

      if (!error) {
        setCashAmount(cashAmount - cost);

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.name === selectedProduct.name
              ? { ...product, quantity: product.quantity + quantity }
              : product
          )
        );

        WebApp.HapticFeedback.impactOccurred("heavy");
        onClose();
      } else {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleMaxClick = () => {
    if (!selectedProduct) return;
    const productPrice =
      supplierPrice[selectedProduct.name as keyof typeof supplierPrice];
    const maxQuantity = Math.floor(cashAmount / productPrice);
    setQuantity(maxQuantity);
  };

  const handleProductSelect = (product: MarketProduct) => {
    setSelectedProduct(product);
  };

  const handleUnlockClick = (product: MarketProduct) => {
    onUnlockClick(tabMapping[product.name]);
  };

  if (!isOpen) return null;

  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 className="text-xl font-bold mb-4 text-white">
          Buy Products - ${cashAmount}
        </h2>
        {selectedProduct && (
          <BottomSection>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {selectedProduct.name} Quantity
              </label>
              <QuantityInputContainer>
                <StyledInput
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <StyledButton onClick={handleMaxClick} className="max">
                  Max
                </StyledButton>
              </QuantityInputContainer>
            </div>
            <ButtonContainer>
              <StyledButton onClick={onClose} className="cancel">
                Cancel
              </StyledButton>
              <StyledButton onClick={handleBuy} className="buy">
                Buy
              </StyledButton>
            </ButtonContainer>
          </BottomSection>
        )}
        {!selectedProduct && (
          <ScrollableTableContainer>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Product</th>
                  <th style={{ width: "25%" }}>Price</th>
                  <th style={{ width: "25%" }}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {marketInfo
                  ? marketInfo.products.map((product) => {
                      const userProduct = userInfo?.products.find(
                        (p) => p.name === product.name
                      );
                      return (
                        <tr
                          key={product.name}
                          className={!userProduct ? "disabled" : ""}
                        >
                          <td>{product.name}</td>
                          <td>
                            $
                            {
                              supplierPrice[
                                product.name as keyof typeof supplierPrice
                              ]
                            }
                          </td>
                          <td className="text-right">
                            {userProduct?.unlocked ? (
                              <button
                                onClick={() => handleProductSelect(product)}
                              >
                                Select
                              </button>
                            ) : (
                              <span
                                className="text-yellow-400 animate-pulse cursor-pointer"
                                onClick={() => handleUnlockClick(product)}
                              >
                                Unlock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </ScrollableTableContainer>
        )}
      </ModalContainer>
      {showToast && (
        <div className="fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right">
          <div className="toast toast-top toast-end">
            <div className="alert alert-error p-4 rounded shadow-lg text-white bg-red-600 font-bold">
              <span>Not enough cash.</span>
            </div>
          </div>
        </div>
      )}
    </FixedOverlay>
  );
};
