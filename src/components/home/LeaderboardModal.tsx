import React, { useEffect } from "react";
import { useFetchLeaderboard } from "../../hooks/useFetchLeaderboard";
import styled from "styled-components";

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
  z-index: 1000;
  flex-direction: column;
  align-items: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef44449c;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #dc2626;
  }
`;

interface LeaderboardModalProps {
  username: string;
  setIsLeaderboardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  username,
  setIsLeaderboardModalOpen
}) => {
  const { leaderboard, fetchLeaderboard } = useFetchLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboard]);

  const onClose = () => {
    setIsLeaderboardModalOpen(false);
  }

  return (
    <ModalContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h1 className="text-center">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Reputation</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => {
              if (user.username === username) {
                return (<tr key={index} className="bg-base-200">
                  <td>{user.rank}</td>
                  <td>{user.username}</td>
                  <td>{user.reputation}</td>
                </tr>)
              }
              
              return (<tr key={index}>
                <td>{user.rank}</td>
                <td>{user.username}</td>
                <td>{user.reputation}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </ModalContainer>
  );
};

export default LeaderboardModal;
