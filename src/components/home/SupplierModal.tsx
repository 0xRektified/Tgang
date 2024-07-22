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
  SiteTitle,
} from "./styles/supplier.css";
import { tabMapping } from "../interfaces/general.interface";
import useBuyProduct from "../../hooks/useBuyProduct";
import useShipProduct from "../../hooks/useShipProduct";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { FlexBoxRow, FlexBoxCol } from "../styled/globalStyled";
import { EShippingUpgrade } from "../interfaces/upgrade.interface";
import styled from "styled-components";
import { addSeconds, differenceInSeconds, formatDuration } from "date-fns";

interface ModalProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUnlockClick: (tab: string) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const RightAlignedTd = styled.td`
  text-align: right;
`;

const Countdown = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e4e4e7;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 0.5rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#4a5568" : "#1b1a1a")};
  color: white;
  border: none;
  outline: none;
  flex-grow: 1;
  &:hover {
    background-color: #4a5568;
  }
`;

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
  const [shippingTime, setShippingTime] = useState<number>(0);
  const [shippingContainers, setShippingContainers] = useState<number>(0);
  const [batch, setBatch] = useState<
    { product: EProduct; amountToSell: number }[]
  >([]);
  const [nextShipCountdown, setnextShipCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeLeft: 0,
  });

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

    const shippingTime = userInfo.shippingUpgrades.find(
      (s) => s.product === EShippingUpgrade.SHIPPING_TIME
    );
    const containerCount = userInfo.shippingUpgrades.find(
      (s) => s.product === EShippingUpgrade.SHIPPING_CONTAINERS
    );

    setShippingTime(shippingTime?.amount || 24 * 3600);
    setShippingContainers(containerCount?.amount || 0);

    if (new Date(userInfo.lastShipment!) < new Date()) {
      const interval = setInterval(() => {
        const countdown = calculateCountdown(userInfo.lastShipment!);
        setnextShipCountdown(countdown);
      }, 1000);

      return () => clearInterval(interval);
    }
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

  const calculateCountdown = (lastShipment: Date) => {
    const now = new Date();
    const timeLeft = differenceInSeconds(
      addSeconds(lastShipment, shippingTime),
      now
    );

    if (timeLeft <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        timeLeft: 0,
      };
    }

    const hours = Math.floor((timeLeft / (60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 60) % 60);
    const seconds = Math.floor(timeLeft % 60);

    return { hours, minutes, seconds, timeLeft };
  };

  const getMaxQuantity = (product: Product) => {
    return Math.min(product.quantity, 10000);
  };

  const pushToBatch = () => {
    if (selectedProduct && "quantity" in selectedProduct) {
      if (batch.length > shippingContainers) {
        console.log("Too many products in batch");
        return;
      }

      setBatch((prevBatch) => {
        const newBatch = prevBatch.filter(
          (b) => b.product !== selectedProduct.name
        );
        newBatch.push({
          product: selectedProduct.name,
          amountToSell: quantity,
        });
        return newBatch;
      });
    }
  };

  const handleShip = () => {
    shipProduct("NY", batch, setUserInfo);
  };

  const duration = () => {
    const hours = Math.floor(shippingTime / 3600);
    const minutes = Math.floor((shippingTime % 3600) / 60);
    return formatDuration({
      hours,
      minutes,
    });
  };

  const renderShippingTime = () => {
    if (nextShipCountdown.timeLeft > 0) {
      return (
        <Countdown>
          <span className="countdown">
            Next shipment in:
            <span
              style={
                {
                  "--value": nextShipCountdown.hours,
                } as React.CSSProperties
              }
            ></span>
            h
            <span
              style={
                {
                  "--value": nextShipCountdown.minutes,
                } as React.CSSProperties
              }
            ></span>
            m
            <span
              style={
                {
                  "--value": nextShipCountdown.seconds,
                } as React.CSSProperties
              }
            ></span>
            s
          </span>
        </Countdown>
      );
    } else {
      return <ShoppingCartTotal>Shipping time: {duration()}</ShoppingCartTotal>;
    }
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
          <>
            <WebPageTitle>https://3g2upl4pq6kufc4m.onion</WebPageTitle>

            <FlexBoxRow>
              <img
                src={`/assets/market_logo.webp`}
                alt="Logo"
                style={{ maxWidth: "50px", padding: "10px" }}
              />
              <SiteTitle>Welcome to Tilk Road</SiteTitle>
            </FlexBoxRow>
            <ShoppingCartFooter>
              <ShoppingCartBalance>
                Balance: ${remainingCash.toFixed(0)}
              </ShoppingCartBalance>
              <ShoppingCartTotal>
                Total: ${totalCost.toFixed(0)}
              </ShoppingCartTotal>
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
                          EProductIcon[
                            product.name as keyof typeof EProductIcon
                          ];
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
          </>
        )}

        {activeTab === "Tedex" && (
          <>
            <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>

            <FlexBoxRow>
              <SiteTitle>Welcome to Tedex</SiteTitle>
            </FlexBoxRow>
            <ScrollableTableContainer>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}></th>
                    <th style={{ width: "30%" }}></th>
                    <th style={{ width: "25%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {userInfo?.products.map((product) => {
                    const productIcon =
                      (product.name as keyof typeof EProductIcon) &&
                      EProductIcon[product.name as keyof typeof EProductIcon];

                    return (
                      <React.Fragment key={product.name}>
                        <tr onClick={() => handleProductSelect(product)}>
                          <td>
                            {product.name + ` `}
                            {productIcon}
                          </td>
                          <td className="text-right">{product.quantity}</td>
                          <td className="text-right">
                            {selectedProduct?.name === product.name ? (
                              <NeonButton
                                onClick={pushToBatch}
                                className="active"
                              >
                                Fill
                              </NeonButton>
                            ) : (
                              <NeonButton className="disabled">Fill</NeonButton>
                            )}
                          </td>
                        </tr>
                        {selectedProduct?.name === product.name && (
                          <tr key={product.name + "_details"}>
                            <td colSpan={5}>
                              <div className="flex items-center justify-between">
                                <input
                                  type="range"
                                  min={0}
                                  max={Math.min(
                                    (selectedProduct as Product).quantity,
                                    10000
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
                  })}
                </tbody>
              </Table>
            </ScrollableTableContainer>
            <FlexBoxRow>
              <ShoppingCartBalance>
                Containers: {batch.length}/{shippingContainers}
              </ShoppingCartBalance>
            </FlexBoxRow>
            <FlexBoxRow>{renderShippingTime()}</FlexBoxRow>

            <Table>
              <thead>
                <tr>
                  <th style={{ width: "50%" }}></th>
                  <th style={{ width: "50%" }}></th>
                </tr>
              </thead>
              <tbody>
                {batch.map((b) => (
                  <tr key={b.product}>
                    <td>{b.product}</td>
                    <RightAlignedTd>{b.amountToSell}</RightAlignedTd>
                  </tr>
                ))}
              </tbody>
            </Table>
            <FlexBoxRow>
              <NeonButton onClick={handleShip} className="active">
                Ship
              </NeonButton>
            </FlexBoxRow>
          </>
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
