import React, { useState, useEffect } from "react";
import { GiAk47 } from "react-icons/gi";
import { FlexBoxRow } from "../styled/globalStyled";
import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";
import WebApp from "@twa-dev/sdk";
import {
  Button,
  Countdown,
  RedDot,
  GreenDot,
  GreenText,
  ItalicText,
  StatDesc,
  StatValue,
  Card,
} from "./styles/airdrop.css";

interface RobberyComponentProps {
  robberyStrike: number;
  claimDailyReward: () => Promise<void>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  loading: boolean;
}

const calculateCountdown = (time: Date) => {
  const now = new Date().getTime();
  const timeInMillis = new Date(time).getTime();
  const timeLeft = 24 * 60 * 60 * 1000 - (now - timeInMillis);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { hours, minutes, seconds, timeLeft };
};

const RobberyComponent: React.FC<RobberyComponentProps> = ({
  robberyStrike,
  claimDailyReward,
  userInfo,
  setUserInfo,
  loading,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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
              new Date(userInfo.lastRobbery!.getTime() + 24 * 60 * 60 * 1000)
            )
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
          i * interval
        );
      }
      claimDailyReward();
      const audioCash = new Audio("/assets/cash_register.mp3");
      audioCash.volume = 0.4;
      audioCash.play();
    }, 2000);
  };

  return (
    <Card>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <StatDesc>Robbery Strike</StatDesc>
          <StatValue>{robberyStrike !== null ? robberyStrike : "0"}</StatValue>
          <Button onClick={handleDailyReward} disabled={isButtonDisabled}>
            <FlexBoxRow>
              {isButtonDisabled ? (
                <>
                  <GiAk47 className="text-2xl" /> Wait for reward
                </>
              ) : (
                <>
                  <GiAk47 className="text-2xl" /> Commit a robbery
                </>
              )}
            </FlexBoxRow>
          </Button>
          {userInfo.lastRobbery && (
            <Countdown>
              {nextRobberyCountdown.hours > 0 ||
              nextRobberyCountdown.minutes > 0 ||
              nextRobberyCountdown.seconds > 0 ? (
                <>
                  <RedDot />{" "}
                  <span className="countdown font-mono text-1xl">
                    <span
                      style={
                        {
                          "--value": nextRobberyCountdown.hours,
                        } as React.CSSProperties
                      }
                    ></span>
                    h
                    <span
                      style={
                        {
                          "--value": nextRobberyCountdown.minutes,
                        } as React.CSSProperties
                      }
                    ></span>
                    m
                    <span
                      style={
                        {
                          "--value": nextRobberyCountdown.seconds,
                        } as React.CSSProperties
                      }
                    ></span>
                    s
                  </span>
                </>
              ) : (
                <>
                  <GreenDot />{" "}
                  <span className="countdown font-mono text-1xl">
                    <span
                      style={
                        {
                          "--value": expireCountdown.hours,
                        } as React.CSSProperties
                      }
                    ></span>
                    h
                    <span
                      style={
                        {
                          "--value": expireCountdown.minutes,
                        } as React.CSSProperties
                      }
                    ></span>
                    m
                    <span
                      style={
                        {
                          "--value": expireCountdown.seconds,
                        } as React.CSSProperties
                      }
                    ></span>
                    s
                  </span>
                </>
              )}
            </Countdown>
          )}
          <StatDesc>
            Next reward will be{" "}
            <GreenText>${(robberyStrike + 1) * 1000}</GreenText>
          </StatDesc>
          <ItalicText>
            **Missing a daily robbery resets your reward to 0
          </ItalicText>
        </>
      )}
    </Card>
  );
};

export default RobberyComponent;
