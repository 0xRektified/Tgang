import React, { useState } from "react";
import { MarketProduct } from "../interfaces/market.interface";
import { EProduct } from "../interfaces/product.interface";
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
} from "./styles/shipping.css";

import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import ProductSelectionModal from "./ProductSelectionModal";
import { FlexBoxCol } from "../styled/globalStyled";
import { ShippingCard } from "./ShippingCard";

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
                  handleOpenModal={handleOpenModal}
                />
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
