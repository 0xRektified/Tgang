import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";
import { ApiToast } from "../ApiToast";
import { GlobalStyle } from "./styles/airdrop.css";
import WalletComponent from "./WalletComponent";
import RobberyComponent from "./RobberyComponent";
import FriendsComponent from "./FriendsComponent";
import { FlexBoxRow, Tab, Tabs } from "../styled/shopStyled";
import mixpanel from "mixpanel-browser";
import { calculateProgress } from "../utils/formater";

const LevelInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ReputationLabel = styled.span`
  font-size: 1.2rem;
`;

const ReputationAmount = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #32cd32;
  margin-left: 2em;
`;

const AirdropContainer = styled.div`
  background: #171c24;
  color: white;
  padding: 0.3rem;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: "Digital", sans-serif;
  touch-action: none;
`;
const AirdropTabContainer = styled.div`
  height: 100vh;
`;

const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
`;
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
  userInfo,
  setUserInfo,
}) => {
  const [currentTab, setCurrentTab] = useState<string>("friends");
  const { reputation, userLevel } = userInfo;
  const { level, title, minReputation, maxReputation } = userLevel;
  const progress = calculateProgress(reputation, minReputation, maxReputation);

  const { robberyStrike, claimDailyReward, loading, error, successMessage } =
    useDailyRobbery(userInfo, setUserInfo);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    mixpanel.track("Airdrop Tab Changed", { tab });
  };

  return (
    <>
      <GlobalStyle />
      <AirdropContainer>
        <AirdropContainer>
          <LevelInfoContainer>
            <ReputationLabel>Reputation level {level}</ReputationLabel>
            <ReputationAmount>
              {userInfo.reputation} / {userInfo.userLevel.maxReputation}
            </ReputationAmount>
          </LevelInfoContainer>
          <DigitalFont>
            Invite users, complete missions and earn reputation to qualify for
            the airdrop
          </DigitalFont>
        </AirdropContainer>

        <FlexBoxRow>
          <Tabs role="tablist">
            <Tab
              role="tab"
              active={currentTab === "friends"}
              onClick={() => handleTabClick("friends")}
            >
              Friends
            </Tab>
            <Tab
              role="tab"
              active={currentTab === "Mission"}
              onClick={() => handleTabClick("Mission")}
            >
              Mission
            </Tab>
            <Tab
              role="tab"
              active={currentTab === "wallet"}
              onClick={() => handleTabClick("wallet")}
            >
              Wallet
            </Tab>
          </Tabs>
        </FlexBoxRow>
        <AirdropTabContainer>
          {currentTab === "friends" && (
            <FriendsComponent
              referralToken={referralToken}
              referredUsers={referredUsers}
            />
          )}
          {currentTab === "wallet" && (
            <WalletComponent userInfo={userInfo} setUserInfo={setUserInfo} />
          )}
          {currentTab === "Mission" && (
            <RobberyComponent
              robberyStrike={robberyStrike}
              claimDailyReward={claimDailyReward}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              loading={loading}
            />
          )}
        </AirdropTabContainer>
        <ApiToast
          loading={loading}
          error={error}
          successMessage={successMessage}
        />
      </AirdropContainer>
    </>
  );
};

export default Airdrop;
