import React, { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { IReferredUsers, IUserInfo } from "../interfaces/user.interface";
import { useTutorial } from "../../hooks/useTutorial";

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
import { SkipButton } from "../home/Home";

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

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  padding-top: 5em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TutorialText = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  margin: 1rem 0;
  max-width: 80%;
`;

interface FriendsComponentProps {
  referralToken: string;
  referredUsers: IReferredUsers[];
  userInfo: IUserInfo;
  tutorial: ReturnType<typeof useTutorial>;
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  referralToken,
  referredUsers,
  userInfo,
  tutorial,
}) => {
  const handleRefForward = () => {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${
        import.meta.env.VITE_WEB_APP_URL
      }?startapp=${referralToken}`,
    );
    if (tutorial.tutorialStep === 5) {
      tutorial.setTutorialCompleted(true);
      tutorial.tutorialCompleted = true;
    }
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`,
    );
  };

  useEffect(() => {
    if (tutorial.tutorialStep === 5) {
      const inviteFriendsButton = document.querySelector(
        ".invite-friends-button",
      );
      if (inviteFriendsButton) {
        inviteFriendsButton.classList.add("tutorial-highlight");
        tutorial.onTutorialProgress();
      }
    }
  }, [tutorial.tutorialStep]);

  const handleSkipTutorial = () => {
    tutorial.setTutorialCompleted(true);
    tutorial.tutorialCompleted = true;
  };

  return (
    <div className="scrollable-content">
      {!tutorial.tutorialCompleted && tutorial.tutorialStep === 5 ? (
        <TutorialOverlay>
          <TutorialText>
            "Invite Friends" below to win real-world money
          </TutorialText>
          <FriendNeonButton onClick={handleRefForward}>
            Invite Friends
          </FriendNeonButton>
          <SkipButton onClick={handleSkipTutorial}>
            End of the Tutorial
          </SkipButton>
        </TutorialOverlay>
      ) : (
        <></>
      )}
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
            {!tutorial.tutorialCompleted &&
            tutorial.tutorialStep === 5 ? null : (
              <FriendNeonButton onClick={handleRefForward}>
                Invite Friends
              </FriendNeonButton>
            )}
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
            <p>$1000 & 2000 XP</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center">
            <h3 className="font-bold">
              Premium <span className="text-2xl">💰💰</span>
            </h3>
            <p>$2000 & 5000 XP</p>
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
