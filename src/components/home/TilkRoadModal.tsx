import React from "react";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { FlexBoxCol, FlexBoxRow } from "../styled/globalStyled";
import {
  NeonButton,
  PriceVariation,
  ScrollableTableContainer,
  ShoppingCartBalance,
  ShoppingCartFooter,
  ShoppingCartTotal,
  SiteTitle,
  Table,
  WebPageTitle,
} from "./styles/supplier.css";
import { useTutorial } from "../../hooks/useTutorial";
import { SkipButton } from "./Home";

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
  tutorial,
}) => {
  const handleSkipTutorial = () => {
    tutorial.setTutorialCompleted(true);
    tutorial.tutorialCompleted = true;
  };
  return (
    <div style={{ position: "relative" }}>
      {tutorial.tutorialCompleted ||
        (tutorial.tutorialStep === 2 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        ))}
      <WebPageTitle>https://3g2upl4pq6kufc4m.onion</WebPageTitle>

      <FlexBoxRow style={{ margin: "10px" }}>
        <FlexBoxCol>
          <img
            src={`/assets/home/market_logo.webp`}
            alt="Logo"
            style={{ maxWidth: "50px", padding: "10px" }}
          />
        </FlexBoxCol>
        <FlexBoxCol style={{ gap: "0px" }}>
          <SiteTitle>Welcome to Tilk Road</SiteTitle>
          <p>
            Market prices shift <b style={{ fontSize: "1.2em" }}>daily</b> with
            global trends. Stay alert to seize every opportunity.
          </p>
        </FlexBoxCol>
      </FlexBoxRow>

      <ShoppingCartFooter>
        <ShoppingCartBalance>
          Balance: ${remainingCash.toFixed(2)}
        </ShoppingCartBalance>
        <ShoppingCartTotal>Total: ${totalCost.toFixed(2)}</ShoppingCartTotal>
      </ShoppingCartFooter>

      {tutorial.tutorialCompleted ||
        (tutorial.tutorialStep === 2 && (
          <div
            style={{
              position: "relative",
              zIndex: 20,
              backgroundColor: "black",
              color: "white",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5em",
            }}
          >
            Click on the Buy button to buy 10 Herb
            <SkipButton onClick={handleSkipTutorial}>Skip Tutorial</SkipButton>
          </div>
        ))}

      <ScrollableTableContainer className="scrollable-content">
        <Table>
          <thead>
            <tr>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "40%" }}></th>
              <th style={{ width: "15%" }}></th>
              <th style={{ width: "25%" }}></th>
            </tr>
          </thead>
          <tbody>
            {marketInfo
              ? marketInfo.products.map((product) => {
                  const userProduct = userInfo?.products.find(
                    (p) => p.name === product.name,
                  );
                  const productIcon =
                    (product.name as keyof typeof EProductIcon) &&
                    EProductIcon[product.name as keyof typeof EProductIcon];

                  const priceChangePercent =
                    ((product.price - product.previousPrice) /
                      product.previousPrice) *
                    100;
                  const priceChangeColor =
                    priceChangePercent > 0 ? "green" : "red";
                  const priceChangeSign = priceChangePercent > 0 ? "+" : "";

                  const isTutorialHerbProduct =
                    tutorial.tutorialCompleted ||
                    (tutorial.tutorialStep === 2 && product.name === "Herb");

                  return (
                    <React.Fragment key={product.name}>
                      <tr
                        className={!userProduct ? "disabled" : ""}
                        onClick={() => handleProductSelect(product)}
                        style={{
                          position: "relative",
                          zIndex: isTutorialHerbProduct ? 20 : "auto",
                        }}
                      >
                        <td>{productIcon}</td>
                        <td>
                          ${product.discountPrice.toFixed(2)}{" "}
                          <PriceVariation style={{ color: priceChangeColor }}>
                            {priceChangeSign}
                            {priceChangePercent.toFixed(2)}%
                          </PriceVariation>
                        </td>
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
                              <NeonButton className="disabled">Buy</NeonButton>
                            )
                          ) : (
                            <span
                              className="text-blue-400 bg-blue-900 bg-opacity-20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-opacity-30 animate-pulse-smooth"
                              onClick={() => handleUnlockClick(product)}
                            >
                              Unlock
                            </span>
                          )}
                        </td>
                      </tr>
                      {userProduct &&
                        selectedProduct?.name === product.name && (
                          <tr
                            key={product.name + "_details"}
                            style={{
                              position: "relative",
                              zIndex: isTutorialHerbProduct ? 20 : "auto",
                            }}
                          >
                            <td colSpan={4}>
                              <div className="flex items-center justify-between">
                                <input
                                  type="range"
                                  min={0}
                                  max={
                                    tutorial.tutorialStep === 2
                                      ? 10
                                      : Math.floor(
                                          remainingCash / product.discountPrice,
                                        )
                                  }
                                  value={quantity}
                                  className="range"
                                  onChange={(e) => {
                                    setQuantity(Number(e.target.value));
                                  }}
                                  disabled={tutorial.tutorialStep === 2}
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
    </div>
  );
};
