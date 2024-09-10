import styled from "styled-components";

export const SocialCard = styled.div`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  padding: 1rem;
  border: 2px solid #285d90;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

export const SocialCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SocialCardImageContainer = styled.div`
  flex-shrink: 0;
`;

export const SocialCardImage = styled.img<{ $title: string }>`
  width: ${({ $title }) =>
    $title === "Cartel X"
      ? "40px"
      : $title === "Cartel Youtube"
      ? "60px"
      : "50px"};
  height: ${({ $title }) =>
    $title === "Cartel X"
      ? "40px"
      : $title === "Cartel Youtube"
      ? "60px"
      : "50px"};
  border-radius: 0.5rem;
  margin-right: 1rem;
`;

export const SocialCardDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SocialCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: white;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const SocialButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
`;

export const SocialButton = styled.button<{ isMember: boolean }>`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  border: 2px solid #1e90ff;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;
  min-width: 70px;
  flex: 1;

  ${({ isMember }) =>
    isMember &&
    `
    background-color: rgba(22, 163, 74, 0.1);
    color: #16a34a;
    border: 2px solid #16a34a;
    cursor: default;
    box-shadow: none;
    
    &:hover {
      background-color: rgba(22, 163, 74, 0.1);
      animation: none;
    }
  `}

  &:hover {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
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

export const RewardInfo = styled.div`
  background-color: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RewardIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: white;
`;

export const RewardText = styled.span`
  font-size: 0.8rem;
  color: #e4e4e7;
`;

export const RewardAmount = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: #16a34a;
`;

export const StatDesc = styled.p`
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const GlobalContainer = styled.div`
  padding: 0 1em;
  min-height: 200vh;
`;
