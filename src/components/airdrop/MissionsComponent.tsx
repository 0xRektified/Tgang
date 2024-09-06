import React, { useState, useEffect } from "react";
import { GiAk47 } from "react-icons/gi";
import { FlexBoxRow } from "../styled/globalStyled";
import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";
import WebApp from "@twa-dev/sdk";
import {
  Countdown,
  RedDot,
  GreenDot,
  GreenText,
  ItalicText,
  StatDesc,
  StatValue,
  Card,
} from "./styles/airdrop.css";
import { ApiToast } from "../ApiToast";
import { NeonButton } from "../styled/cardStyled";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import CountdownComponent from "./CountdownComponent";

const InlineStatDesc = styled(StatDesc)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
`;

const StrikeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RewardInfo = styled.div`
  background-color: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const RewardAmount = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #16a34a;
`;

const StyledRobberyNeonButton = styled(NeonButton)`
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border: none;
  box-shadow: 0 0 10px rgba(22, 163, 74, 0.5);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(22, 163, 74, 0.7);
  }

  &:disabled {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    box-shadow: none;
  }
`;

const MissionFooter = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

interface MissionsComponentProps {
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}
const RobberyNeonButton = styled(NeonButton)`
  width: 16em;
`;
const calculateCountdown = (time: Date) => {
  const now = new Date().getTime();
  const timeInMillis = new Date(time).getTime();
  const timeLeft = 24 * 60 * 60 * 1000 - (now - timeInMillis);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { hours, minutes, seconds, timeLeft };
};

const MissionsComponent: React.FC<MissionsComponentProps> = ({
  userInfo,
  setUserInfo,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const {
    robberyStrike,
    claimDailyReward,
    loading: robberyLoading,
    error: robberyError,
    successMessage: robberySuccessMessage,
  } = useDailyRobbery(userInfo, setUserInfo);

  const [nextRobberyCountdown, setNextRobberyCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [expireCountdown, setExpireCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (userInfo && userInfo.lastRobbery) {
      const interval = setInterval(() => {
        const countdown = calculateCountdown(userInfo.lastRobbery!);
        if (countdown.timeLeft > 0) {
          setNextRobberyCountdown(countdown);
          setIsButtonDisabled(true);
        } else {
          setExpireCountdown(
            calculateCountdown(
              new Date(userInfo.lastRobbery!.getTime() + 24 * 60 * 60 * 1000),
            ),
          );
          setIsButtonDisabled(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userInfo.lastRobbery]);

  const handleDailyReward = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      const audio = new Audio("/assets/ak_robbery.mp3");
      audio.volume = 0.4;
      audio.play();
      const hapticCount = 5;
      const interval = 500 / hapticCount;
      for (let i = 0; i < hapticCount; i++) {
        setTimeout(
          () => WebApp.HapticFeedback.impactOccurred("heavy"),
          i * interval,
        );
      }
      claimDailyReward();
      const audioCash = new Audio("/assets/cash_register.mp3");
      audioCash.volume = 0.4;
      audioCash.play();
    }, 2000);
  };

  const robberyStrikeReward =
    (robberyStrike + 1) * 1000 > 10000 ? 10000 : (robberyStrike + 1) * 1000;

  return (
    <>
      <Card>
        {robberyLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <InlineStatDesc>
              Robbery Strike
              <StatValue>
                {robberyStrike !== null ? robberyStrike : "0"}
              </StatValue>
            </InlineStatDesc>

            <RobberyNeonButton
              onClick={handleDailyReward}
              disabled={isButtonDisabled}
            >
              <FlexBoxRow>
                {isButtonDisabled ? (
                  <>
                    <GiAk47 className="text-4xl" /> Wait for reward
                  </>
                ) : (
                  <>
                    <GiAk47 className="text-4xl" /> Commit a robbery
                  </>
                )}
              </FlexBoxRow>
            </RobberyNeonButton>

            <CountdownComponent lastRobbery={userInfo.lastRobbery} />

            <RewardInfo>
              <FaCoins />
              <StatDesc>Next reward:</StatDesc>
              <RewardAmount>${robberyStrikeReward}</RewardAmount>
            </RewardInfo>
            <MissionFooter>
              <ItalicText>
                **Missing a daily robbery resets your reward to 0
              </ItalicText>
            </MissionFooter>
          </>
        )}
      </Card>
      <ApiToast
        loading={robberyLoading}
        error={robberyError}
        successMessage={robberySuccessMessage}
      />
    </>
  );
};

export default MissionsComponent;
