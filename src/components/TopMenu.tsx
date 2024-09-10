import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
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
import { MdOutlineLeaderboard } from "react-icons/md";

// Add this function at the top of the file, outside the component
const calculateFontSize = (username: string): string => {
  if (username.length <= 10) return "1.2rem";
  if (username.length <= 15) return "1.1rem";
  if (username.length <= 20) return "1rem";
  if (username.length <= 25) return "0.8rem";
  return "0.7rem";
};

interface TopMenuProps {
  userInfo: IUserInfo;
  setCurrentView: (tab: string) => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({
  userInfo,
  setCurrentView,
}) => {
  const [fontSize, setFontSize] = useState("1rem");
  const usernameRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const scrollableEl = document.getElementById("mainView");
    if (scrollableEl) {
      requestAnimationFrame(() => {
        scrollableEl.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.username) {
      setFontSize(calculateFontSize(userInfo.username));
    }
  }, [userInfo]);

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
              <DigitalFont as={Username} ref={usernameRef} style={{ fontSize }}>
                {username}
              </DigitalFont>
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
        <FlexBoxRow>
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
          <FlexBoxCol className="flex justify-end ">
            <MdOutlineLeaderboard
              onClick={() => setCurrentView("Leaderboard")}
            />
          </FlexBoxCol>
        </FlexBoxRow>
      </Container>
    </TopMenuContainer>
  );
};

export default TopMenu;
