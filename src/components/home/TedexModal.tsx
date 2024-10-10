import React, { useState } from "react";
import WebApp from "@twa-dev/sdk";
import styled from "styled-components";
import { MarketProduct } from "../interfaces/market.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, IUserShipping } from "../interfaces/user.interface";
import {
  ScrollableTableContainer,
  WebPageTitle,
  FlexBoxRow,
} from "./styles/supplier.css";
import {
  ShippingCardsContainer,
  SiteTitleTedex,
  SiteDescription,
  StyledLink,
  ClickableText,
} from "./styles/shipping.css";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { FlexBoxCol } from "../styled/globalStyled";
import { ShippingCard } from "./ShippingCard";

const ProductPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  padding: 5px;
`;

const ProductColumn = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5em;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: #242627;
  color: white;
  border: 2px solid ${({ isSelected }) => (isSelected ? "white" : "#374151")};
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? "0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff"
      : "none"};
  margin: 5px;
  min-width: 3em;
  height: 100%;
`;

const ProductIcon = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 5px;
`;

const ProductQuantity = styled.div`
  font-size: 0.8rem;
  color: white;
`;

const ShippingInfo = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
`;

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.8rem auto;
  border: 2px solid #1e90ff;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  width: 8em;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;

  &:hover:not(:disabled) {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:disabled {
    background-color: rgb(99 99 99);
    border: none;
    cursor: not-allowed;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff,
        0 0 8px #1e90ff;
    }
    100% {
      box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff,
        0 0 20px #1e90ff;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ProductName = styled.div`
  font-size: 0.8rem;
  color: white;
  text-align: center;
  margin-top: 5px;
`;

interface TedexProps {
  userInfo: IUserInfo;
  handleShip: (
    shippingMethod: EShippingMethod,
    product: EProduct,
    amount: number,
  ) => void;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  handleRedirectToTilkRoad: () => void;
  handleUnlockClick: (product?: MarketProduct | undefined) => void;
}

export const TedexModal: React.FC<TedexProps> = ({
  userInfo,
  handleShip,
  shippingMethods,
  handleRedirectToTilkRoad,
  handleUnlockClick,
}) => {
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<IUserShipping | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<EProduct | null>(null);

  const handleOpenProductSelection = (userShipping: IUserShipping) => {
    setSelectedShippingMethod(userShipping);
    const firstProduct = userInfo.products.find((p) => p.quantity > 0);
    setSelectedProduct(firstProduct ? firstProduct.name : null);
  };

  const handleSelect = (productName: EProduct) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setSelectedProduct(productName);
  };

  const calculateAmountToShip = async () => {
    if (selectedProduct && selectedShippingMethod) {
      WebApp.HapticFeedback.impactOccurred("heavy");
      const product = userInfo.products.find((p) => p.name === selectedProduct);
      const quantityToShip = product
        ? Math.min(product.quantity, selectedShippingMethod.capacity)
        : 0;
      await handleShip(
        selectedShippingMethod.method,
        selectedProduct,
        quantityToShip,
      );
      setSelectedShippingMethod(null);
      setSelectedProduct(null);
    }
  };
  const handleGoBack = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setSelectedShippingMethod(null);
  };
  const userHasProducts = userInfo.products.some(
    (product) => product.quantity > 0,
  );

  const selectedProductQuantity = selectedProduct
    ? userInfo.products.find((p) => p.name === selectedProduct)?.quantity || 0
    : 0;

  const shippingInfoMessage = selectedProduct
    ? selectedProductQuantity === 0
      ? `You don't have enough ${EProductIcon[selectedProduct]}`
      : `You are about to ship up to ${selectedShippingMethod?.capacity} ${EProductIcon[selectedProduct]}`
    : "Select a product to ship";

  return (
    <>
      <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>

      <FlexBoxRow style={{ margin: "10px" }}>
        <FlexBoxCol style={{ gap: "0px" }}>
          <SiteTitleTedex>
            Welcome to <span className="te">Te</span>
            <span className="dex">Dex</span>
          </SiteTitleTedex>
          <SiteDescription>
            Shipping doesn't decrease your customer amount.
          </SiteDescription>
          <StyledLink onClick={() => handleUnlockClick()}>
            Unlock more.
          </StyledLink>
        </FlexBoxCol>
      </FlexBoxRow>
      <ScrollableTableContainer className="scrollable-content">
        {selectedShippingMethod ? (
          <div>
            <ShippingInfo>{shippingInfoMessage}</ShippingInfo>
            <ProductPanel>
              {Object.values(EProduct).map((productName) => {
                const product = userInfo.products.find(
                  (p) => p.name === productName,
                );
                const quantity = product ? product.quantity : 0;
                const isSelected = selectedProduct === productName;

                return (
                  <ProductColumn
                    key={productName}
                    isSelected={isSelected}
                    onClick={() => handleSelect(productName)}
                  >
                    <ProductQuantity>{quantity}</ProductQuantity>
                    <ProductIcon>{EProductIcon[productName]}</ProductIcon>
                    <ProductName>{productName}</ProductName>
                  </ProductColumn>
                );
              })}
            </ProductPanel>
            {userHasProducts ? (
              <ButtonContainer>
                <NeonButton onClick={handleGoBack}>{"<-"} Go back</NeonButton>
                <NeonButton
                  onClick={calculateAmountToShip}
                  disabled={!selectedProduct || selectedProductQuantity === 0}
                >
                  Ship Product
                </NeonButton>
              </ButtonContainer>
            ) : (
              <ClickableText onClick={handleRedirectToTilkRoad}>
                You have no products. Click here to go to Tilk Road to buy some.
              </ClickableText>
            )}
          </div>
        ) : (
          <ShippingCardsContainer>
            {shippingMethods &&
              Object.entries(shippingMethods).map(([key, method]) => {
                const methodKey = key as EShippingMethod;
                const userShipping = userInfo.shipping.find(
                  (ship) => ship.method === methodKey,
                );
                const locked = !userShipping;

                return (
                  <ShippingCard
                    key={key}
                    method={method}
                    userShipping={userShipping}
                    locked={locked}
                    handleUnlockClick={() => handleUnlockClick()}
                    handleOpenModal={handleOpenProductSelection}
                  />
                );
              })}
          </ShippingCardsContainer>
        )}
      </ScrollableTableContainer>
    </>
  );
};
