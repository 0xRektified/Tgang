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
import { SupplierModal } from "./home/modals/SupplierModal";
import { Upgrades } from "./shop/utils/types";

interface TopMenuProps {
  userInfo: IUserInfo | undefined;
  cashAmount: number;
  products: Product[];
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onUnlockClick: (tab: keyof Upgrades) => void;
}
export const TopMenu: React.FC<TopMenuProps> = ({
  userInfo,
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
              <button
                className="btn btn-primary mt-4"
                onClick={handleOpenSupplierModal}
              >
                📱 Buy Drugs
              </button>
            </FlexBoxCol>
          </FlexBoxRow>
        </FlexBoxRow>
      </Container>
      {isSupplierModalOpen && (
        <SupplierModal
          isOpen={isSupplierModalOpen}
          onClose={handleCloseSupplierModal}
          products={products}
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
