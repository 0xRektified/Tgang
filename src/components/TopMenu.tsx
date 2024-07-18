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
import { IMarketInfo } from "./interfaces/market.interface";
import { formatPrice } from "./utils/formater";

interface TopMenuProps {
  userInfo: IUserInfo;
}

export const TopMenu: React.FC<TopMenuProps> = ({ userInfo }) => {
  useLayoutEffect(() => {
    const scrollableEl = document.getElementById("mainView");
    if (scrollableEl) {
      requestAnimationFrame(() => {
        scrollableEl.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

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
          </FlexBoxCol>
          <FlexBoxCol>
            <div className="justify-end space-x-2">
              <DigitalFont as={BalanceLabel}>Cash</DigitalFont>
              <DigitalFont as={BalanceAmount}>
                {formatPrice(userInfo.cashAmount, false)}
              </DigitalFont>
            </div>
          </FlexBoxCol>
        </FlexBoxRow>
      </Container>
    </TopMenuContainer>
  );
};

export default TopMenu;
