import React from "react";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { TutorialOverlay } from "./TutorialOverlay";
import { useTutorial } from "../../hooks/useTutorial";
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
  ProductMiddleRow,
  ProductIcon,
  // ProductPrice,
  Price,
  PriceChange,
  // QuantityControl,
  QuantityInput,
  QuantitySlider,
  BuyButton,
  UnlockButton,
  ScrollableTableContainer,
  WebPageTitle,
} from "./styles/tilkRoadModal.css";

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
  return (
    <>
      <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>
      <TutorialOverlay step={2} tutorial={tutorial}>
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

          <ScrollableTableContainer className="scrollable-content">
            <ProductGrid>
              {marketInfo?.products.map((product) => {
                const userProduct = userInfo?.products.find(
                  (p) => p.name === product.name,
                );
                const productIcon =
                  EProductIcon[product.name as keyof typeof EProductIcon];
                const priceChangePercent =
                  ((product.price - product.previousPrice) /
                    product.previousPrice) *
                  100;
                const isSelected = selectedProduct?.name === product.name;
                const currentQuantity = isSelected ? quantity : 0;

                return (
                  <ProductCard key={product.name} locked={!userProduct}>
                    <ProductTopRow>
                      <ProductIcon>{productIcon}</ProductIcon>
                      <Price>${product.discountPrice.toFixed(2)}</Price>
                      <PriceChange increase={priceChangePercent > 0}>
                        {priceChangePercent > 0 ? "+" : ""}
                        {priceChangePercent.toFixed(2)}%
                      </PriceChange>
                    </ProductTopRow>
                    {userProduct && (
                      <>
                        <ProductMiddleRow>
                          <BuyButton onClick={handleBuy} disabled={!isSelected}>
                            Buy
                          </BuyButton>
                          <QuantityInput
                            type="number"
                            min={0}
                            max={
                              tutorial.tutorialStep === 2
                                ? 10
                                : Math.floor(
                                    remainingCash / product.discountPrice,
                                  )
                            }
                            value={currentQuantity}
                            onChange={(e) => {
                              const newQuantity = Number(e.target.value);
                              setQuantity(newQuantity);
                              setSelectedProduct(
                                newQuantity > 0 ? product : null,
                              );
                            }}
                          />
                        </ProductMiddleRow>
                        <QuantitySlider
                          type="range"
                          min={0}
                          max={
                            tutorial.tutorialStep === 2
                              ? 10
                              : Math.floor(
                                  remainingCash / product.discountPrice,
                                )
                          }
                          value={currentQuantity}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            setQuantity(newQuantity);
                            setSelectedProduct(
                              newQuantity > 0 ? product : null,
                            );
                          }}
                        />
                      </>
                    )}
                    {!userProduct && (
                      <UnlockButton onClick={() => handleUnlockClick(product)}>
                        Unlock
                      </UnlockButton>
                    )}
                  </ProductCard>
                );
              })}
            </ProductGrid>
          </ScrollableTableContainer>
        </TilkRoadContainer>
      </TutorialOverlay>
    </>
  );
};
