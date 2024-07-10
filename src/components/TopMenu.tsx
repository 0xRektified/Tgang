import React, { useLayoutEffect, useState } from "react";
import { IUserInfo, Product } from "./interfaces/user.interface";
import rank from "/assets/rank.png";
import {
  TopMenuContainer,
  Container,
  RankIcon,
  DigitalFont,
  Username,
  BalanceLabel,
  BalanceAmount,
} from "./styled/topmenu";
import { FlexBoxCol, FlexBoxRow } from "./styled/globalStyled";
import { SupplierModal } from "./home/SupplierModal";
import { IMarketInfo } from "./interfaces/market.interface";

import styled from "styled-components";

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 6px;
  padding: 0.5rem 0.7rem;
  box-shadow: 0 0 10px #eab308, 0 0 15px #eab308, 0 0 20px #eab308;
  border: 2px solid #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.5em;
`;

const NeonText = styled.span``;

interface TopMenuProps {
  userInfo: IUserInfo | undefined;
  marketInfo: IMarketInfo | undefined;
  cashAmount: number;
  products: Product[];
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onUnlockClick: (tab: string) => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({
  userInfo,
  marketInfo,
  cashAmount,
  products,
  setCashAmount,
  setProducts,
  onUnlockClick,
}) => {
  const [isSupplierModalOpen, setIsSupplierModalOpen] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    const scrollableEl = document.getElementById("mainView");
    if (scrollableEl) {
      requestAnimationFrame(() => {
        scrollableEl.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  const handleOpenSupplierModal = () => {
    setIsSupplierModalOpen(true);
  };

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  return (
    <TopMenuContainer id="mainView">
      <Container>
        <FlexBoxRow className="w-full justify-between">
          <FlexBoxCol>
            <div className="flex items-center space-x-2">
              <RankIcon src={rank} alt="Rank" />
              <DigitalFont as={Username}>
                {userInfo ? userInfo.username : `Welcome`}
              </DigitalFont>
            </div>
            <FlexBoxRow>
              <DigitalFont as={BalanceLabel}>Cash</DigitalFont>
              <DigitalFont as={BalanceAmount}>${cashAmount}</DigitalFont>
            </FlexBoxRow>
          </FlexBoxCol>
          <FlexBoxCol className="items-end"></FlexBoxCol>
          <FlexBoxRow className="justify-between items-center">
            <FlexBoxCol className="flex justify-end mr-5">
              <NeonButton onClick={handleOpenSupplierModal}>
                <ButtonIcon>📱</ButtonIcon>
                <NeonText>Buy Drugs</NeonText>
              </NeonButton>
            </FlexBoxCol>
          </FlexBoxRow>
        </FlexBoxRow>
      </Container>
      {isSupplierModalOpen && (
        <SupplierModal
          userInfo={userInfo}
          marketInfo={marketInfo}
          isOpen={isSupplierModalOpen}
          onClose={handleCloseSupplierModal}
          setProducts={setProducts}
          cashAmount={cashAmount}
          setCashAmount={setCashAmount}
          onUnlockClick={onUnlockClick}
        />
      )}
    </TopMenuContainer>
  );
};

export default TopMenu;
