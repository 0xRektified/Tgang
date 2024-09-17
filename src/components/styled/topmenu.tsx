import styled from "styled-components";

export const TopMenuContainer = styled.div`
  background-color: #242627;
  color: white;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: "Digital", sans-serif;
  border: 1px solid #333;
  touch-action: none;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 0 !important;
`;

export const RankIcon = styled.img`
  width: 30px;
  height: 30px;
`;

export const Username = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const LevelTitle = styled.span`
  font-size: 0.9rem;
  color: #888;
  display: block;
`;

export const BalanceLabel = styled.span`
  font-size: 0.9rem;
  color: #888;
  display: block;
  text-align: right;
`;

export const BalanceAmount = styled.span`
  padding-top: 0.2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #4adf81;
  display: block;
  text-align: right;
`;

export const DigitalFont = styled.span`
  font-family: "Digital", sans-serif;
`;

export const LevelInfo = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

export const ProgressBar = styled.progress`
  &.progress {
    width: 100%;
    height: 0.5rem;
    ::-webkit-progress-bar {
      background-color: #333;
    }
    ::-webkit-progress-value {
      background-color: #ff9800;
    }
  }
`;

export const LevelLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
  padding: 0 2px;
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
