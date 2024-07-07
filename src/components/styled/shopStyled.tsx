import styled from "styled-components";

// Styled components
export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #1c1c1e;
  border-radius: 0.375rem;
  width: 100%;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

export const Tab = styled.a<{ active: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3a3a3c" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#8e8e93")};
  border-radius: 0.375rem;
  &:hover {
    background-color: #3a3a3c;
    color: #fff;
  }
`;

export const UpgradeContainer = styled.div`
  background-color: #1c1c1e;
  width: 100%;
  padding: 1rem;
  overflow-y: scroll;
  height: 40rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

export const UpgradeCard = styled.div<{ locked: boolean }>`
  background-color: #2c2c2e;
  padding: 1rem;
  border-radius: 0.375rem;
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(0.95);
  }
  border: 1px solid #3a3a3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardImage = styled.figure`
  margin: 0;
  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.375rem;
    border: 1px solid #3a3a3c;
  }
`;

export const CardDetails = styled.div`
  text-align: right;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #8e8e93;
`;

export const CardBody = styled.div`
  flex-grow: 1;
  color: #fff;
`;

export const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
`;

export const CardDescription = styled.p`
  color: #8e8e93;
`;

export const ShopContainer = styled.div`
  background-color: #1c1c1e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;
