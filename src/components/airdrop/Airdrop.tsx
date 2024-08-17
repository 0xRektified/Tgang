import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { PiCopySimple } from "react-icons/pi";
import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";
import { GiAk47 } from "react-icons/gi";
import { FlexBoxCol, FlexBoxRow } from "../styled/globalStyled";
import { ApiToast } from "../ApiToast";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../../hooks/useTonConnect";
import {
  AirdropContainer,
  Button,
  Card,
  Countdown,
  Divider,
  GreenDot,
  GreenText,
  ItalicText,
  RedDot,
  StatDesc,
  Stats,
  StatValue,
  Table,
  TableContainer,
  WalletInfo,
} from "./styles/airdrop.css";
import WalletComponent from "./WalletComponent";
import RobberyComponent from "./RobberyComponent";
import FriendsComponent from "./FriendsComponent";

interface AirdropProps {
  referralToken: string;
  referredUsers: string[];
  activeTab: string;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
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

const Airdrop: React.FC<AirdropProps> = ({
  referralToken,
  referredUsers,
  activeTab,
  userInfo,
  setUserInfo,
}) => {
  const { robberyStrike, claimDailyReward, loading, error, successMessage } =
    useDailyRobbery(userInfo, setUserInfo);

  return (
    <AirdropContainer>
      <WalletComponent />
      <RobberyComponent
        robberyStrike={robberyStrike}
        claimDailyReward={claimDailyReward}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        loading={loading}
      />
      <FriendsComponent
        referralToken={referralToken}
        referredUsers={referredUsers}
      />
      <ApiToast
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </AirdropContainer>
  );
};

export default Airdrop;
