import React, { useEffect } from "react";
import { useFetchLeaderboard } from "../hooks/useFetchLeaderboard";
import styled from "styled-components";

const LeaderboardContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
`;

interface LeaderboardProps {
  username: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ username }) => {
  const { leaderboard, fetchLeaderboard } = useFetchLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <LeaderboardContainer className="scrollable-content">
      <h1 className="text-center text-3xl mb-6">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Reputation</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={index}
                className={user.username === username ? "bg-base-200" : ""}
              >
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.reputation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
