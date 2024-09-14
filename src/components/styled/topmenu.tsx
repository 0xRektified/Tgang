import styled from "styled-components";

export const TopMenuContainer = styled.div`
  background: linear-gradient(180deg, #1e2734, #111217);
  color: white;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: "Digital", sans-serif;
  border: 1px solid #333;
  border-radius: 12px; /* Adding slight rounding to match the cards */
  touch-action: none;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const RankIcon = styled.img`
  width: 30px;
  height: 30px;
`;

export const Username = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const BalanceLabel = styled.span`
  font-size: 1.2rem;
`;

export const BalanceAmount = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #32cd32;
`;

export const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
`;

export const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
  span {
    margin-right: 0.1rem;
    padding-right: 0.5rem;
  }
`;

export const ProgressBar = styled.progress`
  &.progress {
    height: 0.5rem;
    ::-webkit-progress-bar {
      background-color: #333;
    }
    ::-webkit-progress-value {
      background-color: #ff9800;
    }
  }
`;

// Added for item cards
export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #222;
  border-radius: 8px;
  padding: 10px;
  margin: 0.5rem;
  width: 60px;
  color: white;
  font-size: 1rem;
  span:first-child {
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
  }
`;
