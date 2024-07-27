import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { PiCopySimple } from "react-icons/pi";
import styled from "styled-components";
import useDailyRobbery from "../../hooks/useDailyRobbery";
import { IUserInfo } from "../interfaces/user.interface";
import { GiAk47 } from "react-icons/gi";
import { FlexBoxRow } from "../styled/globalStyled";

const MissionContainer = styled.div`
  background-color: #1c1c1e;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const Card = styled.div`
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  background-color: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem;

  &:hover {
    background-color: #15803d;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #4a4a4a;
  margin: 0 0.5rem;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`;

const StatDesc = styled.div`
  font-size: 1rem;
  color: #9ca3af;
`;

const GreenText = styled.span`
  color: #16a34a;
  font-weight: bold;
`;

const Countdown = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #4a4a4a;
    color: white;
  }

  th {
    background-color: #2a2a2e;
  }
`;

const GreenDot = styled.span`
  height: 1rem;
  width: 1rem;
  background-color: #16a34a;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.5rem;
`;

const RedDot = styled.span`
  height: 1rem;
  width: 1rem;
  background-color: #dc2626;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.5rem;
`;

const ItalicText = styled.div`
  font-size: 0.8rem;
  font-style: italic;
  color: #9ca3af;
  text-align: right;
  margin-top: 0.5rem;
  width: 100%;
`;

interface MissionProps {
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

const Mission: React.FC<MissionProps> = ({
  referralToken,
  referredUsers,
  activeTab,
  userInfo,
  setUserInfo,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const { robberyStrike, claimDailyReward, loading, error } = useDailyRobbery(
    userInfo,
    setUserInfo
  );

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
    setCurrentTab(activeTab);
  }, [activeTab]);

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

  const handleRefForward = () => {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${
        import.meta.env.VITE_WEB_APP_URL
      }?startapp=${referralToken}`
    );
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`
    );
  };

  const handleDailyReward = () => {
    const audio = new Audio("/assets/ak_robbery.mp3");
    audio.volume = 0.4;
    audio.play();
    setIsButtonDisabled(true);

    setTimeout(() => {
      claimDailyReward();
      const hapticCount = 5;
      const interval = 500 / hapticCount;
      for (let i = 0; i < hapticCount; i++) {
        setTimeout(
          () => WebApp.HapticFeedback.impactOccurred("heavy"),
          i * interval
        );
      }
      const audioCash = new Audio("/assets/cash_register.mp3");
      audioCash.volume = 0.4;
      audioCash.play();
    }, 2000);
  };

  return (
    <MissionContainer>
      <Card>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <StatDesc>Robbery Strike</StatDesc>
            <StatValue>
              {robberyStrike !== null ? robberyStrike : "0"}
            </StatValue>
            <Button onClick={handleDailyReward} disabled={isButtonDisabled}>
              <FlexBoxRow>
                <GiAk47 className="text-2xl" /> Commit a robbery
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
      <Card>
        <div className="flex w-full place-items-center justify-center">
          <Button onClick={handleRefForward}>Invite Friends</Button>
          <Divider />
          <Button onClick={handleRefClick}>
            <PiCopySimple />
          </Button>
        </div>
      </Card>
      <Card>
        <Stats>
          <StatDesc>Invited users</StatDesc>
          <StatValue>{referredUsers.length}</StatValue>
          <StatDesc>Airdrop to be announced</StatDesc>
        </Stats>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Referred Users</th>
              </tr>
            </thead>
            <tbody>
              {referredUsers.map((user) => (
                <tr key={user}>
                  <td>{user}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    </MissionContainer>
  );
};

export default Mission;
