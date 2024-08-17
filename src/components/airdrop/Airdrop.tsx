import React from "react";

import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";

import { ApiToast } from "../ApiToast";

import { AirdropContainer } from "./styles/airdrop.css";
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
      <WalletComponent userInfo={userInfo} setUserInfo={setUserInfo} />
      <FriendsComponent
        referralToken={referralToken}
        referredUsers={referredUsers}
      />
      <RobberyComponent
        robberyStrike={robberyStrike}
        claimDailyReward={claimDailyReward}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        loading={loading}
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
