import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { TutorialOverlay } from "./TutorialOverlay";
import { useTutorial } from "../../hooks/useTutorial";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatPrice } from "../utils/formater";
import WebApp from "@twa-dev/sdk";

import {
  TilkRoadContainer,
  TilkRoadHeader,
  TilkRoadLogo,
  TilkRoadTitle,
  TilkRoadDescription,
  ShoppingCartInfo,
  Balance,
  Total,
  ProductGrid,
  ProductCard,
  ProductTopRow,
  ProductIcon,
  Price,
  PriceChange,
  ProductControls,
  BuyButton,
  QuantityInput,
  QuantitySlider,
  UnlockButton,
  ScrollableTableContainer,
  WebPageTitle,
  BuyControlsRow,
  ProductIconWrapper,
} from "./styles/tilkRoadModal.css";
import { NeonButton, NeonRedButton } from "../styled/cardStyled";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ModalText = styled.p`
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const PriceText = styled.span`
  color: #22c55e;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ConfirmButton = styled.button`
  background-color: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16a34a;
  }
`;

const CancelButton = styled(ConfirmButton)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef44449c;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #dc2626;
  }
`;

function isMarketProduct(
  product: Product | MarketProduct,
): product is MarketProduct {
  return "discountPrice" in product;
}

interface TilkRoadModalProps {
  remainingCash: number;
  totalCost: number;
  marketInfo: IMarketInfo | undefined;
  userInfo: IUserInfo;
  selectedProduct: Product | MarketProduct | null;
  quantity: number;
  handleBuy: () => Promise<void>;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleProductSelect: (product: Product | MarketProduct) => void;
  handleUnlockClick: (product: MarketProduct) => void;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<Product | MarketProduct | null>
  >;
  tutorial: ReturnType<typeof useTutorial>;
}

export const TilkRoadModal: React.FC<TilkRoadModalProps> = ({
  remainingCash,
  totalCost,
  marketInfo,
  userInfo,
  selectedProduct,
  quantity,
  handleBuy,
  setQuantity,
  handleProductSelect,
  handleUnlockClick,
  setSelectedProduct,
  tutorial,
}) => {
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (marketInfo?.products) {
      const initialQuantities = marketInfo.products.reduce(
        (acc, product, index) => {
          acc[product.name] = index === 0 ? 1 : 0;
          return acc;
        },
        {} as Record<string, number>,
      );
      setProductQuantities(initialQuantities);

      if (marketInfo.products.length > 0) {
        const firstProduct = marketInfo.products[0];
        setSelectedProduct(firstProduct);
        setQuantity(1);
      }
    }
  }, [marketInfo, setSelectedProduct, setQuantity]);

  const handleQuantityChange = (
    product: MarketProduct,
    newQuantity: number,
  ) => {
    setProductQuantities((prev) => {
      const updatedQuantities = { ...prev };
      Object.keys(updatedQuantities).forEach((key) => {
        updatedQuantities[key] = 0;
      });
      updatedQuantities[product.name] = newQuantity;
      return updatedQuantities;
    });

    if (newQuantity > 0) {
      setSelectedProduct(product);
      setQuantity(newQuantity);
    } else {
      setSelectedProduct(null);
      setQuantity(0);
    }
  };

  const isInTutorialMode =
    tutorial.tutorialStep === 2 && !tutorial.tutorialCompleted;

  const productsToDisplay =
    isInTutorialMode && marketInfo?.products
      ? [marketInfo.products[0]]
      : marketInfo?.products || [];

  const handleInputBlur = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleBuyClick = () => {
    if (selectedProduct && isMarketProduct(selectedProduct) && quantity > 0) {
      WebApp.HapticFeedback.impactOccurred("heavy");
      setShowConfirmation(true);
    }
  };

  const handleConfirmPurchase = async () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    await handleBuy();
    setShowConfirmation(false);
  };

  return (
    <>
      <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>
      <TilkRoadContainer>
        <TilkRoadHeader>
          <TilkRoadLogo
            src="/assets/home/market_logo.webp"
            alt="Tilk Road Logo"
          />
          <div>
            <TilkRoadTitle>Welcome to Tilk Road</TilkRoadTitle>
            <TilkRoadDescription>
              Buy more resources to sell to your customers.
            </TilkRoadDescription>
          </div>
        </TilkRoadHeader>

        <ShoppingCartInfo>
          <Balance>Balance: ${remainingCash.toFixed(2)}</Balance>
          <Total>Total: ${totalCost.toFixed(2)}</Total>
        </ShoppingCartInfo>
        <TutorialOverlay step={2} tutorial={tutorial}>
          <ScrollableTableContainer className="scrollable-content">
            <ProductGrid>
              {productsToDisplay.map((product) => {
                const userProduct = userInfo?.products.find(
                  (p) => p.name === product.name,
                );
                const productIcon =
                  EProductIcon[product.name as keyof typeof EProductIcon];
                const priceChangePercent =
                  ((product.price - product.previousPrice) /
                    product.previousPrice) *
                  100;
                const currentQuantity = quantity;

                return (
                  <ProductCard key={product.name} locked={!userProduct}>
                    <ProductTopRow>
                      <ProductIconWrapper>
                        <ProductIcon>{productIcon}</ProductIcon>
                        <Price>${product.discountPrice.toFixed(2)}</Price>
                      </ProductIconWrapper>
                      <PriceChange increase={priceChangePercent > 0}>
                        {priceChangePercent > 0 ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                        {Math.abs(priceChangePercent).toFixed(2)}%
                      </PriceChange>
                    </ProductTopRow>
                    {userProduct ? (
                      <ProductControls>
                        <BuyControlsRow>
                          <BuyButton
                            onClick={handleBuyClick}
                            disabled={productQuantities[product.name] === 0}
                          >
                            Buy
                          </BuyButton>
                          <QuantityInput
                            type="number"
                            min={0}
                            max={
                              isInTutorialMode
                                ? 10
                                : Math.floor(
                                    remainingCash / product.discountPrice,
                                  )
                            }
                            value={productQuantities[product.name]}
                            onChange={(e) => {
                              const newQuantity = Number(e.target.value);
                              handleQuantityChange(product, newQuantity);
                            }}
                            onBlur={handleInputBlur}
                          />
                        </BuyControlsRow>
                        <QuantitySlider
                          type="range"
                          min={0}
                          max={
                            isInTutorialMode
                              ? 10
                              : Math.floor(
                                  remainingCash / product.discountPrice,
                                )
                          }
                          value={productQuantities[product.name]}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            handleQuantityChange(product, newQuantity);
                            handleInputBlur();
                          }}
                        />
                      </ProductControls>
                    ) : (
                      <UnlockButton onClick={() => handleUnlockClick(product)}>
                        Unlock
                      </UnlockButton>
                    )}
                  </ProductCard>
                );
              })}
            </ProductGrid>
          </ScrollableTableContainer>
        </TutorialOverlay>
      </TilkRoadContainer>

      {showConfirmation &&
        selectedProduct &&
        isMarketProduct(selectedProduct) && (
          <ModalBackground onClick={() => setShowConfirmation(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setShowConfirmation(false)}>
                &times;
              </CloseButton>
              <ModalHeader>Confirm Purchase</ModalHeader>
              <ModalText>
                Are you sure you want to buy {quantity}{" "}
                {
                  EProductIcon[
                    selectedProduct.name as keyof typeof EProductIcon
                  ]
                }{" "}
                for{" "}
                <PriceText>
                  {formatPrice(quantity * selectedProduct.discountPrice, true)}
                </PriceText>{" "}
                ?
              </ModalText>
              <ButtonContainer>
                <NeonButton onClick={handleConfirmPurchase}>Confirm</NeonButton>
                <NeonRedButton onClick={() => setShowConfirmation(false)}>
                  Cancel
                </NeonRedButton>
              </ButtonContainer>
            </ModalContent>
          </ModalBackground>
        )}
    </>
  );
};
