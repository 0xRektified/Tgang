import React, { useState } from "react";
import styled from "styled-components";
import { IReferredUsers, IUserInfo } from "../interfaces/user.interface";
import WalletComponent from "./WalletComponent";
import FriendsComponent from "./FriendsComponent";
import { FlexBoxRow, Tab, Tabs } from "../styled/shopStyled";
import mixpanel from "mixpanel-browser";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import MissionsComponent from "./MissionsComponent";
import { useTutorial } from "../../hooks/useTutorial";
import SocialComponent from "./SocialComponent";
import SocialModal from "./SocialModal";

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


interface AirdropProps {
  referralToken: string;
  referredUsers: IReferredUsers[];
  activeTab: string;
  userInfo: IUserInfo;
  socials: Record<SocialChannel, SocialData>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  tutorial: ReturnType<typeof useTutorial>;
}

const Airdrop: React.FC<AirdropProps> = ({
  referralToken,
  referredUsers,
  userInfo,
  socials,
  setUserInfo,
  tutorial,
}) => {
  const [currentTab, setCurrentTab] = useState<string>("friends");
  const [isSocialModalOpen, setIsSocialModalOpen] =
    useState<boolean>(false);

  const handleCloseSocialModal = () => {
    setIsSocialModalOpen(false);
  };

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
            tutorial={tutorial}
          />
        )}
        {currentTab === "wallet" && (
          <WalletComponent userInfo={userInfo} setUserInfo={setUserInfo} />
        )}
        {currentTab === "missions" && (
          <>
            <MissionsComponent
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
            <SocialComponent
              socials={socials}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setIsSocialModalOpen={setIsSocialModalOpen}
            />
          </>
        )}
      </AirdropTabContainer>
      {isSocialModalOpen && (
        <SocialModal
          onClose={handleCloseSocialModal}
        />
      )}
    </AirdropContainer>
  );
};

export default Airdrop;
