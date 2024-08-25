import React, { useEffect, useState } from "react";
import { MarketProduct } from "../interfaces/market.interface";
import { EProduct } from "../interfaces/product.interface";
import {
  IUserInfo,
  IUserShipping,
} from "../interfaces/user.interface";
import { Duration, intervalToDuration } from "date-fns";
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
  NeonButtonShippingLocked,
  SiteTitleTedex,
  SiteDescription,
  StyledLink,
} from "./styles/shipping.css";

import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import ProductSelectionModal from "./ProductSelectionModal";
import { FlexBoxCol } from "../styled/globalStyled";

interface TedexProps {
  userInfo: IUserInfo;
  handleShip: (
    shippingMethod: EShippingMethod,
    product: EProduct,
    amount: number
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<IUserShipping | null>(null);

  const handleOpenModal = (userShipping: IUserShipping) => {
    setSelectedShippingMethod(userShipping);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const shipmentInProgress = (nextShipment: Date) => {
    return nextShipment.getTime() > new Date().getTime();
  };

  const [nextShipmentCountdown, setNextShipmentCountDown] = useState<Record<EShippingMethod, Duration>>({
    Envelope: { hours: 0, minutes: 0, seconds: 0 },
    Package: { hours: 0, minutes: 0, seconds: 0 },
    Pallet: { hours: 0, minutes: 0, seconds: 0 },
    Truck: { hours: 0, minutes: 0, seconds: 0 },
    Container: { hours: 0, minutes: 0, seconds: 0 },
    Plane: { hours: 0, minutes: 0, seconds: 0 },
    Rocket: { hours: 0, minutes: 0, seconds: 0 },
  });

  useEffect(() => {
    if (userInfo && userInfo.shipping) {
      const interval = setInterval(() => {
        // Create a new object to avoid direct mutation
        const updatedCountdowns = { ...nextShipmentCountdown };
  
        userInfo.shipping.forEach((userShipping) => {
          const countdown = calculateCountdown(new Date(userShipping.nextShipment));
          updatedCountdowns[userShipping.method] = countdown;
        });
  
        // Update the state with the new object
        setNextShipmentCountDown(updatedCountdowns);
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [nextShipmentCountdown]);

  const calculateCountdown = (nextShipment: Date) => {
    const now = new Date().getTime();
    const nextShipmentTime = nextShipment.getTime();
    if (nextShipmentTime < now) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const duration = intervalToDuration({
      start: new Date(),
      end: nextShipment,
    });

    return {
      hours: duration.hours || 0,
      minutes: duration.minutes || 0,
      seconds: duration.seconds || 0,
    }
  };

  const renderShippingButton = (userShipping: IUserShipping) => {
    if (shipmentInProgress(new Date(userShipping.nextShipment))) {
      return (
        <NeonButtonShippingLocked onClick={() => handleUnlockClick()}>
          In progress
        </NeonButtonShippingLocked>
      );
    } else {
      return (
        <NeonButtonShipping onClick={() => handleOpenModal(userShipping!)}>
          Ship up to {userShipping.capacity}
        </NeonButtonShipping>
      );
    }
  };

  return (
    <>
      <WebPageTitle>https://mv09mn0u123m.onion</WebPageTitle>
      <FlexBoxRow>
        <SiteTitle></SiteTitle>
      </FlexBoxRow>

      <FlexBoxRow style={{ margin: "10px" }}>
        <FlexBoxCol style={{ gap: "0px" }}>
          <SiteTitleTedex>
            Welcome to <span className="te">Te</span>
            <span className="dex">Dex</span>
          </SiteTitleTedex>
          <SiteDescription>
            Tedex is your global shipping platform, enabling you to ship any
            product worldwide with ease.{" "}
            <StyledLink onClick={() => handleUnlockClick()}>
              Check the different shipping options available.
            </StyledLink>
          </SiteDescription>
        </FlexBoxCol>
      </FlexBoxRow>
      <ScrollableTableContainer className="scrollable-content">
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
                        <span
                          className="text-blue-400 bg-blue-900 bg-opacity-20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-opacity-30 animate-pulse-smooth"
                          onClick={() => handleUnlockClick()}
                        >
                          Unlock
                        </span>
                      ) : (
                        renderShippingButton(userShipping!)
                      )}
                    </CardInfoColumn>
                    {userShipping && (
                      <div>
                        <div>Next shipment</div>
                        <div>
                          {
                            nextShipmentCountdown[userShipping.method].hours + "h " +
                            nextShipmentCountdown[userShipping.method].minutes + "m " +
                            nextShipmentCountdown[userShipping.method].seconds + "s"
                          }
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CardContainer>
              );
            })}
        </ShippingCardsContainer>
      </ScrollableTableContainer>
      {isModalOpen && selectedShippingMethod && (
        <ProductSelectionModal
          userInfo={userInfo}
          onClose={handleCloseModal}
          shippingMethod={selectedShippingMethod.method}
          amount={selectedShippingMethod.capacity}
          handleShip={handleShip}
          onRedirectToTilkRoad={handleRedirectToTilkRoad}
        />
      )}
    </>
  );
};