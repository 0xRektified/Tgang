import React, { useState, useEffect } from "react";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { TutorialOverlay } from "./TutorialOverlay";
import { useTutorial } from "../../hooks/useTutorial";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
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
import { c } from "vite/dist/node/types.d-aGj9QkWt";

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
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize quantities for all products
    if (marketInfo?.products) {
      const initialQuantities = marketInfo.products.reduce((acc, product) => {
        acc[product.name] = 0;
        return acc;
      }, {} as Record<string, number>);
      setProductQuantities(initialQuantities);
    }
  }, [marketInfo]);

  const handleQuantityChange = (product: MarketProduct, newQuantity: number) => {
    setProductQuantities(prev => {
      const updatedQuantities = { ...prev };
      // Set all products to 0
      Object.keys(updatedQuantities).forEach(key => {
        updatedQuantities[key] = 0;
      });
      // Set the selected product to the new quantity
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
                            onClick={() => {
                              handleBuy();
                            }}
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
    </>
  );
};
