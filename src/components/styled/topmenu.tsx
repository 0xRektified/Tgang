import styled from "styled-components";

// Styled components
export const TopMenuContainer = styled.div`
  background: linear-gradient(180deg, #1e2734, #111217);
  color: white;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: "Digital", sans-serif;
  border: 1px solid #333;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: #32cd32;
`;

export const DigitalFont = styled.span`
  @font-face {
    font-family: "Digital";
    src: url("/path/to/digital-font.ttf") format("truetype");
  }
  font-family: "Digital", sans-serif;
`;

export const pulse = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
