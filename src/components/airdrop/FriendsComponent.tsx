import React from "react";
import WebApp from "@twa-dev/sdk";
import { IUserInfo } from "../interfaces/user.interface";

import { PiCopySimple } from "react-icons/pi";
import {
  Button,
  Divider,
  Card,
  Stats,
  StatDesc,
  StatValue,
  Table,
  TableContainer,
} from "./styles/airdrop.css";
import styled from "styled-components";

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
  touch-action: none;
`;

const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
  font-size: 0.9rem;
`;

interface FriendsComponentProps {
  referralToken: string;
  referredUsers: string[];
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
    <>
      <AirdropContainer>
        <LevelInfoContainer>
          <ReputationLabel>Reputation level {level}</ReputationLabel>
          <ReputationAmount>
            {userInfo.reputation} / {userInfo.userLevel.maxReputation}
          </ReputationAmount>
        </LevelInfoContainer>
        <DigitalFont>
          Invite users and earn reputation to qualify for the airdrop
        </DigitalFont>
      </AirdropContainer>
      <Card className="scrollable-content">
        <div className="w-1/4 flex flex-col items-center justify-center">
          <Stats>
            <StatDesc>Invited users</StatDesc>
            <StatValue>{referredUsers.length}</StatValue>
          </Stats>
        </div>
        <div className="flex w-full place-items-center justify-center">
          <Button onClick={handleRefForward}>Invite Friends</Button>
          <Divider />
          <Button onClick={handleRefClick}>
            <PiCopySimple />
          </Button>
        </div>
        <div className="w-3/4 flex flex-col  ">
          <div className="flex mb-4">
            <div className=" flex flex-col ">
              <div className="mb-4">
                <h3 className="font-bold">
                  Invite User <span className="text-2xl mb-4">💰</span>
                </h3>
                <p>Earn $1000 and 500 reputation</p>
              </div>
              {/* <div>
        <h3 className="font-bold">
          Invite Premium User <span className="text-2xl">💰💰💰</span>
        </h3>
        <p>Earn $2000 and 1000 reputation</p>
      </div> */}
            </div>
          </div>
        </div>
        <TableContainer>
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
                  <td>{referredUsers[index] || "-"}</td>
                  <td>
                    {referredUsers[index] && (
                      <span style={{ color: "#32cd32" }}>+1000$</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default FriendsComponent;
