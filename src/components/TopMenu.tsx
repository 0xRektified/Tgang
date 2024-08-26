import React, { useLayoutEffect } from "react";
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
  LevelInfo,
  ProgressBar,
} from "./styled/topmenu";
import { FlexBoxCol, FlexBoxRow } from "./styled/globalStyled";
import { calculateProgress, formatPrice } from "./utils/formater";

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

  if (!userInfo) return null;

  const { reputation, userLevel, username, cashAmount } = userInfo;
  const { level, title, minReputation, maxReputation } = userLevel;
  const progress = calculateProgress(reputation, minReputation, maxReputation);

  return (
    <TopMenuContainer id="mainView">
      <Container>
        <FlexBoxRow className="w-full justify-between items-center">
          <FlexBoxCol>
            <div className="flex items-center space-x-2">
              <RankIcon src={rank} alt="Rank" />
              <DigitalFont as={Username}>{username}</DigitalFont>
            </div>
          </FlexBoxCol>
          <FlexBoxCol>
            <div className="flex justify-end space-x-2">
              <DigitalFont as={BalanceLabel}>Cash</DigitalFont>
              <DigitalFont as={BalanceAmount}>
                {formatPrice(cashAmount, false)}
              </DigitalFont>
            </div>
          </FlexBoxCol>
        </FlexBoxRow>
        <FlexBoxCol className="w-full">
          <LevelInfo>
            <span>
              Lvl {level} {title}
            </span>
            <ProgressBar
              className=" progress progress-warning w-40"
              value={progress}
              max="100"
            ></ProgressBar>
          </LevelInfo>
        </FlexBoxCol>
      </Container>
    </TopMenuContainer>
  );
};

export default TopMenu;
