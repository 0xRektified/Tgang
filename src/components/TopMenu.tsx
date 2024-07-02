import React from "react";
import { IUserInfo } from "./interfaces/user.interface";
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
import { FlexBoxCol, FlexBoxRow } from "./styled/styled";

interface TopMenuProps {
  userInfo: IUserInfo | undefined;
  cashAmount: number;
  customerNbr: number;
}
export const TopMenu: React.FC<TopMenuProps> = ({
  userInfo,
  cashAmount,
  customerNbr,
}) => {
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
            <div>
              <span className="text-sm">Customer waiting: 5</span>
            </div>
          </FlexBoxCol>
          <FlexBoxCol className="items-end">
            <DigitalFont as={BalanceLabel}>Current balance</DigitalFont>
            <DigitalFont as={BalanceAmount}>${cashAmount}</DigitalFont>
          </FlexBoxCol>
        </FlexBoxRow>
      </Container>
    </TopMenuContainer>
  );
};

export default TopMenu;
