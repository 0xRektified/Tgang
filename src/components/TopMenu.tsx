import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { IUserInfo } from "./interfaces/user.interface";
import rank from "/assets/rank.png";
import styled, { keyframes } from "styled-components";
import {
  TopMenuContainer,
  Container,
  RankIcon,
  DigitalFont,
  Username,
  LevelTitle,
  BalanceLabel,
  BalanceAmount,
  LevelLabels,
} from "./styled/topmenu";
import { FlexBoxCol, FlexBoxRow } from "./styled/globalStyled";
import { calculateProgress, formatPrice } from "./utils/formater";
import { MdOutlineLeaderboard } from "react-icons/md";

// Progress bar components
const HorizontalProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 5px rgba(30, 144, 255, 0.3);
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
  50% { box-shadow: 0 0 4px #1e90ff, 0 0 8px #1e90ff; }
  100% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
`;

const ProgressFill = styled.div<{ width: number; isDecreasing: boolean }>`
  height: 100%;
  width: ${(props) => props.width}%;
  background-color: #1e90ff;
  position: absolute;
  left: 0;
  transition: width 0.3s ease-out;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0)
    );
    animation: ${glowAnimation} 1.5s infinite;
  }
`;

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
        <FlexBoxRow className="w-full justify-between items-start gap-0">
          <FlexBoxCol>
            <div className="flex items-center space-x-2">
              <RankIcon src={rank} alt="Rank" />
              <div>
                <DigitalFont
                  as={Username}
                  ref={usernameRef}
                  style={{ fontSize }}
                >
                  {username}
                </DigitalFont>
                <LevelTitle>{title}</LevelTitle>
              </div>
            </div>
          </FlexBoxCol>
          <FlexBoxCol style={{ gap: 0 }}>
            <DigitalFont as={BalanceAmount}>
              {formatPrice(cashAmount, false)}
            </DigitalFont>
            <DigitalFont as={BalanceLabel}>Cash</DigitalFont>
          </FlexBoxCol>
        </FlexBoxRow>
        <FlexBoxRow
          className="w-full items-center mt-2"
          style={{ gap: 0, margin: 0 }}
        >
          <FlexBoxCol className="flex-grow gap-0">
            <HorizontalProgressBarContainer>
              <ProgressFill width={progress} isDecreasing={false} />
            </HorizontalProgressBarContainer>
            <LevelLabels style={{ gap: 0 }}>
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </LevelLabels>
          </FlexBoxCol>
          <FlexBoxCol className="items-center ml-2">
            <MdOutlineLeaderboard
              className="cursor-pointer"
              onClick={() => setCurrentView("Leaderboard")}
              size={36}
            />
          </FlexBoxCol>
        </FlexBoxRow>
      </Container>
    </TopMenuContainer>
  );
};

export default TopMenu;
