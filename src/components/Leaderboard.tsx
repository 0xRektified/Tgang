import React, { useEffect } from "react";
import { useFetchLeaderboard } from "../hooks/useFetchLeaderboard";
import styled from "styled-components";
import leaderboardImage from "/assets/leaderboard/leaderBoard.png";
import { IUserInfo } from "./interfaces/user.interface";
import { PiCrownFill } from "react-icons/pi";

const LevelInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ReputationLabel = styled.span`
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
`;

const ReputationAmount = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

const LeaderboardContainer = styled.div`
  background: #071119;
  color: white;
  width: 100%;
  height: 110vh;

  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0;
  margin-bottom: 15rem;
  height: 100em;
`;

const LeaderboardImage = styled.img`
  width: 100%;
  height: auto;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
`;

const TopSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

const UserInfo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const UserRank = styled.div`
  font-size: 1.6rem;
  font-weight: bold;

  margin-bottom: 0.5rem;
`;

const ScrollableTableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;

  th,
  td {
    padding: 1rem;
    text-align: left;
    white-space: nowrap;
  }

  thead tr {
    background-color: #2a2a2a;
  }

  tbody tr {
    background-color: #222;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #333;
    }
  }

  .highlight {
    background-color: #3a3a3a;
    font-weight: bold;
  }

  .rank-column {
    width: 10%;
  }

  .username-column {
    width: 60%;
  }

  .reputation-column {
    width: 30%;
  }

  @media (max-width: 768px) {
    .username-column {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const CrownIcon = styled(PiCrownFill)<{ color: string }>`
  color: ${props => props.color};
  margin-right: 0.5rem;
`;

interface LeaderboardProps {
  userInfo: IUserInfo;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userInfo }) => {
  const { leaderboard, fetchLeaderboard } = useFetchLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const userRank =
    leaderboard.findIndex(
      (leaderboardUser) => userInfo.username === leaderboardUser.username,
    ) + 1;

  return (
    <LeaderboardContainer className="scrollable-content">
      <ScrollableContent>
        <LeaderboardImage src={leaderboardImage} alt="Leaderboard" />
        <TopSection>
          <UserRank>
            Your Rank: {userRank > 0 ? `${userRank}` : "100+"}
          </UserRank>
          <UserInfo>
            <LevelInfoContainer>
              <ReputationLabel>
                {userInfo.userLevel.title} level {userInfo.userLevel.level}
              </ReputationLabel>
              <ReputationAmount>
                {userInfo.reputation} / {userInfo.userLevel.maxReputation}
              </ReputationAmount>
            </LevelInfoContainer>
          </UserInfo>
        </TopSection>
        <ScrollableTableContainer>
          <StyledTable>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={index}
                  className={
                    user.username === userInfo.username ? "highlight" : ""
                  }
                >
                  <td className="rank-column">
                    {index === 0 && <CrownIcon color="#FFD700" />}
                    {index === 1 && <CrownIcon color="#C0C0C0" />}
                    {index === 2 && <CrownIcon color="#CD7F32" />}
                    {index + 1}
                  </td>
                  <td className="username-column">{user.username}</td>
                  <td className="reputation-column">{user.reputation}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </ScrollableTableContainer>
      </ScrollableContent>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
