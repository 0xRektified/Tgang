import styled from "styled-components";
import { FaTrophy, FaStopwatch } from "react-icons/fa";

export const AchievementCard = styled.div<{ isUnlocked: boolean }>`
  background: ${({ isUnlocked }) =>
    isUnlocked
      ? "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))"
      : "linear-gradient(135deg, #282c34, #3c3f45)"};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  padding: 1rem;
  border: ${({ isUnlocked }) =>
    isUnlocked ? "2px solid gold" : "1px solid #ccc"};
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

export const AchievementTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1em;
`;

export const AchievementBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const AchievementIconContainer = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`;

export const AchievementIcon = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
`;

export const AchievementDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AchievementTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin: 0;
`;

export const AchievementDescription = styled.p`
  font-size: 0.9rem;
  color: white;
  font-weight: bold;
  margin: 0;
`;

export const AchievementRequirements = styled.p`
  font-size: 0.8rem;
  color: white;
  margin: 0;
  flex: 1;
`;

export const UnlockButton = styled.button<{ unlocked: boolean }>`
  background-color: ${(props) =>
    props.unlocked ? "rgba(22, 163, 74, 0.1)" : "rgb(39 39 42)"};
  color: ${(props) => (props.unlocked ? "#16a34a" : "#e4e4e7")};
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  border: 2px solid ${(props) => (props.unlocked ? "#ffd7008f" : "#1e90ff")};
  cursor: ${(props) => (props.unlocked ? "default" : "pointer")};
  font-weight: bold;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: ${(props) =>
    props.unlocked
      ? "none"
      : "0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff"};

  ${({ unlocked }) =>
    unlocked &&
    `
    background: none;
    border: none;
    color: inherit;
    cursor: default;
    &:hover {
      background: none;
    }
  `}

  &:hover {
    background-color: ${(props) =>
      props.unlocked ? "rgba(22, 163, 74, 0.1)" : "rgb(24 24 27)"};
    animation: ${(props) =>
      props.unlocked
        ? "none"
        : "glow 1.5s infinite alternate, pulse 2s infinite"};
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff,
        0 0 8px #1e90ff;
    }
    100% {
      box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff,
        0 0 20px #1e90ff;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
`;

export const AchievementReward = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RewardIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #ffd700;
`;

export const RewardText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #16a34a;
`;

export const GlobalContainer = styled.div`
  padding: 0 1em;
  min-height: 200vh;
`;

export const StatDesc = styled.p`
  font-weight: bold;
  margin-bottom: 1em;
`;

export const AchievementProgress = styled.div`
  background-color: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  width: 70%;
  height: 10px;
  background-color: rgba(30, 144, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    width: ${(props) => props.$progress}%;
    height: 100%;
    background-color: #1e90ff;
    transition: width 0.3s ease;
  }
`;

export const ProgressText = styled.span`
  font-size: 0.8rem;
  color: #e4e4e7;
`;

export const AchievementsSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
`;

export const TrophyIcon = styled(FaTrophy)`
  color: #ffd700;
`;

export const LimitedOfferBanner = styled.div`
  color: #1e90ff;

  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.7em;
`;

export const CountdownTimer = styled.span`
  margin-left: 0.5rem;
  font-family: "Roboto Mono", monospace;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 700;
`;

export const StopwatchIcon = styled(FaStopwatch)`
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #1e90ff;
`;
