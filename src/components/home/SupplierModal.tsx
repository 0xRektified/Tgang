import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import {
  CloseButton,
  FixedOverlay,
  ModalContainer,
  Notch,
  ScrollableTableContainer,
  StyledButton,
  Table,
  ShoppingCartFooter,
  ShoppingCartBalance,
  ShoppingCartTotal,
  RoundButton,
  NeonButton,
  WebPageTitle,
} from "./styles/supplier.css";
import { tabMapping } from "../interfaces/general.interface";
import useBuyProduct from "../../hooks/useBuyProduct";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProductIcon } from "../interfaces/product.interface";

interface SupplierModalProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUnlockClick: (tab: string) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  userInfo,
  marketInfo,
  isOpen,
  onClose,
  onUnlockClick,
  setUserInfo,
}) => {
  const { buyProduct, loading, error } = useBuyProduct();
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [remainingCash, setRemainingCash] = useState<number>(
    userInfo.cashAmount
  );

  useEffect(() => {
    setTotalCost(selectedProduct ? selectedProduct.discountPrice * quantity : 0);
    setRemainingCash(
      userInfo.cashAmount -
        (selectedProduct ? selectedProduct.discountPrice * quantity : 0)
    );
  });

  const handleBuy = async () => {
    if (totalCost > userInfo.cashAmount) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    if (selectedProduct) {
      await buyProduct("NY", selectedProduct.name, quantity, setUserInfo);
    }
    setSelectedProduct(null);
    setQuantity(1);
    WebApp.HapticFeedback.impactOccurred("heavy");
  };

  const handleMaxClick = () => {
    if (!selectedProduct) return;
    const productPrice = selectedProduct.discountPrice;
    const maxQuantity = Math.floor(userInfo.cashAmount / productPrice);

    setQuantity(maxQuantity);
  };

  const handleProductSelect = (product: MarketProduct) => {
    setSelectedProduct((prevSelectedProduct) =>
      prevSelectedProduct?.name === product.name ? null : product
    );
    setQuantity(1);
  };

  const handleUnlockClick = (product: MarketProduct) => {
    onUnlockClick(tabMapping[product.name]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Notch />
        <WebPageTitle>https://3g2upl4pq6kufc4m.onion</WebPageTitle>
        <ShoppingCartFooter>
          <ShoppingCartBalance>
            Balance: ${remainingCash.toFixed(0)}
          </ShoppingCartBalance>
          <ShoppingCartTotal>Total: ${totalCost.toFixed(0)}</ShoppingCartTotal>
        </ShoppingCartFooter>
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <th style={{ width: "35%" }}></th>
                <th style={{ width: "20%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "25%" }}></th>
              </tr>
            </thead>
            <tbody>
              {marketInfo
                ? marketInfo.products.map((product) => {
                    const userProduct = userInfo?.products.find(
                      (p) => p.name === product.name
                    );
                    const productIcon =
                      (product.name as keyof typeof EProductIcon) &&
                      EProductIcon[product.name as keyof typeof EProductIcon];
                    return (
                      <React.Fragment key={product.name}>
                        <tr
                          className={!userProduct ? "disabled" : ""}
                          onClick={() => handleProductSelect(product)}
                        >
                          <td>
                            {product.name + ` `}
                            {productIcon}
                          </td>
                          <td>${product.discountPrice}</td>
                          <td className="text-right">
                            {selectedProduct?.name === product.name
                              ? quantity
                              : 0}
                          </td>
                          <td className="text-right">
                            {userProduct ? (
                              selectedProduct?.name === product.name ? (
                                <NeonButton
                                  onClick={handleBuy}
                                  className="active"
                                >
                                  Buy
                                </NeonButton>
                              ) : (
                                <NeonButton className="disabled">
                                  Buy
                                </NeonButton>
                              )
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
                        {userProduct &&
                          selectedProduct?.name === product.name && (
                            <tr key={product.name + "_details"}>
                              <td colSpan={5}>
                                <div className="flex items-center justify-between">
                                  <input
                                    type="range"
                                    min={0}
                                    max={Math.floor(
                                      remainingCash / product.discountPrice
                                    )}
                                    value={quantity}
                                    className="range"
                                    onChange={(e) => {
                                      setQuantity(Number(e.target.value));
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </ScrollableTableContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <RoundButton onClick={onClose}>&times;</RoundButton>
      </ModalContainer>
      {showToast && (
        <div className="fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right">
          <div className="toast toast-top toast-end">
            <div className="alert alert-error p-4 rounded shadow-lg text-white bg-red-600 font-bold">
              <span>{error ? error : `Not enough cash.`}</span>
            </div>
          </div>
        </div>
      )}
    </FixedOverlay>
  );
};
