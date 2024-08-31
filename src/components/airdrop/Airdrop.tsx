import React, { useState } from "react";
import styled from "styled-components";
import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IReferredUsers, IUserInfo } from "../interfaces/user.interface";
import { ApiToast } from "../ApiToast";
import WalletComponent from "./WalletComponent";
import RobberyComponent from "./RobberyComponent";
import FriendsComponent from "./FriendsComponent";
import { FlexBoxRow, Tab, Tabs } from "../styled/shopStyled";
import mixpanel from "mixpanel-browser";
import SocialComponent from "./SocialComponent";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import { useVerifySocial } from "../../hooks/useVerifySocial";

const AirdropContainer = styled.div`
  background: #171c24;
  color: white;
  padding: 0.3rem;
  width: 100%;
  font-family: "Digital", sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AirdropTabContainer = styled.div`
  height: calc(100vh - 50px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;
const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
  font-size: 0.9rem;
`;

interface AirdropProps {
  referralToken: string;
  referredUsers: IReferredUsers[];
  activeTab: string;
  userInfo: IUserInfo;
  socials: Record<SocialChannel, SocialData>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const Airdrop: React.FC<AirdropProps> = ({
  referralToken,
  referredUsers,
  userInfo,
  socials,
  setUserInfo,
}) => {
  const [currentTab, setCurrentTab] = useState<string>("friends");

  const {
    robberyStrike,
    claimDailyReward,
    loading: robberyLoading,
    error: robberyError,
    successMessage: robberySuccessMessage,
  } =
    useDailyRobbery(userInfo, setUserInfo);

  const {
    verifySocial,
    loading: socialLoading,
    error: socialError,
    successMessage: socialSuccessMessage,
  } = useVerifySocial();

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    mixpanel.track("Airdrop Tab Changed", { tab });
  };

  return (
    <AirdropContainer className="scrollable-content">
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
            active={currentTab === "missions"}
            onClick={() => handleTabClick("missions")}
          >
            Missions
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

      <AirdropTabContainer className="scrollable-content">
        {currentTab === "friends" && (
          <FriendsComponent
            referralToken={referralToken}
            referredUsers={referredUsers}
            userInfo={userInfo}
          />
        )}
        {currentTab === "wallet" && (
          <WalletComponent userInfo={userInfo} setUserInfo={setUserInfo} />
        )}
        {currentTab === "missions" && (
          <RobberyComponent
            robberyStrike={robberyStrike}
            claimDailyReward={claimDailyReward}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            socials={socials}
            verifySocial={verifySocial}
            robberyLoading={robberyLoading}
            socialLoading={socialLoading}
          />
        )}
      </AirdropTabContainer>
      <ApiToast
        loading={robberyLoading || socialLoading}
        error={robberyError || socialError}
        successMessage={robberySuccessMessage || socialSuccessMessage}
      />
    </AirdropContainer>
  );
};

export default Airdrop;
