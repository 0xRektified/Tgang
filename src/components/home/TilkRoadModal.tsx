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
}) => {
  return (
    <>
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
          Balance: ${remainingCash.toFixed(0)}
        </ShoppingCartBalance>
        <ShoppingCartTotal>Total: ${totalCost.toFixed(0)}</ShoppingCartTotal>
      </ShoppingCartFooter>
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
                    (p) => p.name === product.name
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
                  return (
                    <React.Fragment key={product.name}>
                      <tr
                        className={!userProduct ? "disabled" : ""}
                        onClick={() => handleProductSelect(product)}
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
                          <tr key={product.name + "_details"}>
                            <td colSpan={4}>
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
  );
};