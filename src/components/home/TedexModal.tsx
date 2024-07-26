import React, { useState } from "react";
import { MarketProduct } from "../interfaces/market.interface";
import { EProduct } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { addSeconds, differenceInSeconds } from "date-fns";
import {
  ScrollableTableContainer,
  WebPageTitle,
  SiteTitle,
  FlexBoxRow,
} from "./styles/supplier.css";

import {
  CardContainer,
  CardHeader,
  CardContent,
  CardTitle,
  CardImage,
  CardDetails,
  CardInfoColumn,
  NeonButtonShipping,
  ShippingCardsContainer,
} from "./styles/shipping.css";

import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import ProductSelectionModal from "./ProductSelectionModal";

interface TedexProps {
  userInfo: IUserInfo;
  selectedProduct: Product | MarketProduct | null;
  quantity: number;
  handleShip: () => void;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleProductSelect: (product: Product | MarketProduct) => void;
  setShippingBatch: React.Dispatch<
    React.SetStateAction<{
      shippingMethod: EShippingMethod;
      product: EProduct;
      amount: number;
    }>
  >;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
}

const calculateCountdown = (lastShipment: Date, shippingTime: number) => {
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

export const TedexModal: React.FC<TedexProps> = ({
  userInfo,
  selectedProduct,
  quantity,
  handleShip,
  setQuantity,
  handleProductSelect,
  setShippingBatch,
  shippingMethods,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setShippingBatch({
      shippingMethod: "" as EShippingMethod,
      product: product.name,
      amount: product.quantity,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>
      <FlexBoxRow>
        <SiteTitle>Welcome to Tedex</SiteTitle>
      </FlexBoxRow>
      <ScrollableTableContainer>
        <ShippingCardsContainer>
          {shippingMethods &&
            Object.entries(shippingMethods).map(([key, method]) => {
              const methodKey = key as EShippingMethod;
              const userShipping = userInfo.shipping.find(
                (ship) => ship.method === methodKey
              );
              const price =
                userShipping?.upgradeShippingTimePrice || method.basePrice;
              const locked = !userShipping;

              return (
                <CardContainer key={key} locked={locked}>
                  <CardTitle>{method.title}</CardTitle>
                  <CardHeader>
                    <CardDetails>
                      <CardImage src={method.image} alt={method.title} />
                    </CardDetails>
                  </CardHeader>
                  <CardContent>
                    <CardInfoColumn>
                      {locked ? (
                        <NeonButtonShipping disabled>Locked</NeonButtonShipping>
                      ) : (
                        <NeonButtonShipping onClick={handleOpenModal}>
                          Ship {method.baseCapacity} unit
                        </NeonButtonShipping>
                      )}
                    </CardInfoColumn>
                    {userShipping && (
                      <div>
                        <div>Next shipment</div>
                        <div>
                          {
                            calculateCountdown(
                              new Date(userShipping.nextShipment),
                              method.basShippingTime
                            ).hours
                          }
                          h{" "}
                          {
                            calculateCountdown(
                              new Date(userShipping.nextShipment),
                              method.basShippingTime
                            ).minutes
                          }
                          m{" "}
                          {
                            calculateCountdown(
                              new Date(userShipping.nextShipment),
                              method.basShippingTime
                            ).seconds
                          }
                          s
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CardContainer>
              );
            })}
        </ShippingCardsContainer>
      </ScrollableTableContainer>
      {isModalOpen && (
        <ProductSelectionModal
          userInfo={userInfo}
          onClose={handleCloseModal}
          onSelectProduct={handleSelectProduct}
        />
      )}
    </>
  );
};
