import React from "react";
import WebApp from "@twa-dev/sdk";
import { IReferredUsers, IUserInfo } from "../interfaces/user.interface";

import { PiCopySimpleBold } from "react-icons/pi";
import {
  Button,
  Card,
  Stats,
  StatDesc,
  StatValue,
  Table,
  TableContainer,
} from "./styles/airdrop.css";
import styled from "styled-components";
import { NeonButton } from "../styled/cardStyled";

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
  font-family: "Digital", sans-serif;
`;

const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
  font-size: 0.9rem;
`;

const ScrollableTableContainer = styled(TableContainer)`
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10rem;
`;

const AnnouncementContainer = styled.div`
  background: #2c3e50;
  color: #ecf0f1;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
`;

const AnnouncementLink = styled.a`
  color: #3498db;
  text-decoration: underline;
  &:hover {
    color: #2980b9;
  }
`;

const InlineStatDesc = styled(StatDesc)`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const FriendNeonButton = styled(NeonButton)`
  width: 100%;
  height: 3rem;
`;

const CopyNeonButton = styled(NeonButton)`
  height: 3rem;
  width: 3rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface FriendsComponentProps {
  referralToken: string;
  referredUsers: IReferredUsers[];
  userInfo: IUserInfo;
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  referralToken,
  referredUsers,
  userInfo,
}) => {
  const { userLevel } = userInfo;
  const { level } = userLevel;
  const handleRefForward = () => {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${
        import.meta.env.VITE_WEB_APP_URL
      }?startapp=${referralToken}`,
    );
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`,
    );
  };

  return (
    <div className="space-y-4 scrollable-content">
      <AirdropContainer>
        <LevelInfoContainer>
          <ReputationLabel>Reputation level {level}</ReputationLabel>
          <ReputationAmount>
            {userInfo.reputation} / {userInfo.userLevel.maxReputation}
          </ReputationAmount>
        </LevelInfoContainer>
        <AnnouncementContainer>
          <p>
            🎉 Exciting news! Beta testers can win real-world prizes totaling over $600 USD!
          </p>
          <AnnouncementLink
            href="https://t.me/cartel_game_community"
            target="_blank"
            rel="noopener noreferrer"
          >
            Details in our community page
          </AnnouncementLink>{" "}
          🚀
        </AnnouncementContainer>
      </AirdropContainer>
      {/* <DigitalFont>
        Invite users and earn reputation to qualify for the airdrop
      </DigitalFont> */}
      <Card className="scrollable-content">
        <div className="flex flex-row items-center justify-start mb-4">
          <Stats>
            <InlineStatDesc>
              Invited users:
              <StatValue>{referredUsers.length}</StatValue>
            </InlineStatDesc>
          </Stats>
        </div>
        <div className="flex w-full mb-4">
          <div className="flex-grow">
            <FriendNeonButton onClick={handleRefForward}>
              Invite Friends
            </FriendNeonButton>
          </div>
          <div className="ml-4">
            <CopyNeonButton onClick={handleRefClick}>
              <PiCopySimpleBold className="text-xl font-bold" />
            </CopyNeonButton>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pb-4">
          <div className="card flex flex-col justify-center items-center text-center">
            <h3 className="font-bold">
              Per invite <span className="text-2xl">💰</span>
            </h3>
            <p>$1000 & 100rep</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center">
            <h3 className="font-bold">
              Premium <span className="text-2xl">💰💰</span>
            </h3>
            <p>$2000 & 1000rep</p>
          </div>
        </div>
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Referred Users</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(Math.max(3, referredUsers.length))].map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{referredUsers[index]?.username || "-"}</td>
                  <td>
                    {referredUsers[index]?.reward && (
                      <span style={{ color: "#32cd32" }}>
                        +{referredUsers[index]?.reward}$
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollableTableContainer>
      </Card>
    </div>
  );
};

export default FriendsComponent;
