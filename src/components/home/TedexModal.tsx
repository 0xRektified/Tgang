import React, { useState, useEffect } from "react";
import { MarketProduct } from "../interfaces/market.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { FlexBoxRow } from "../styled/globalStyled";
import { addSeconds, differenceInSeconds, formatDuration } from "date-fns";

import {
  ScrollableTableContainer,
  Table,
  ShoppingCartBalance,
  ShoppingCartTotal,
  NeonButton,
  WebPageTitle,
  SiteTitle,
  RightAlignedTd,
  Countdown,
} from "./styles/supplier.css";
import { EShippingUpgrade } from "../interfaces/upgrade.interface";

interface TedexProps {
  userInfo: IUserInfo;
  selectedProduct: Product | MarketProduct | null;
  quantity: number;
  batch: {
    product: EProduct;
    amountToSell: number;
  }[];
  handleShip: () => void;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleProductSelect: (product: Product | MarketProduct) => void;
  setBatch: React.Dispatch<
    React.SetStateAction<
      {
        product: EProduct;
        amountToSell: number;
      }[]
    >
  >;
}

export const TedexModal: React.FC<TedexProps> = ({
  userInfo,
  selectedProduct,
  quantity,
  batch,
  handleShip,
  setQuantity,
  handleProductSelect,
  setBatch,
}) => {
  const [shippingTime, setShippingTime] = useState<number>(0);
  const [shippingContainers, setShippingContainers] = useState<number>(0);
  const [nextShipCountdown, setnextShipCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeLeft: 0,
  });

  useEffect(() => {
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

  return (
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
                        <NeonButton onClick={pushToBatch} className="active">
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
  );
};
