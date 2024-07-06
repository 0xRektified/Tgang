import styled from "styled-components";

// Styled components
export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #1f2937;
  border-radius: 0.375rem;
`;

export const Tab = styled.a<{ active: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#9ca3af")};
  border-radius: 0.375rem;
  &:hover {
    background-color: #3b82f6;
    color: #fff;
  }
`;

export const UpgradeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  height: 40rem;
  gap: 1rem;
  justify-content: center;
`;

export const UpgradeCard = styled.div<{ locked: boolean }>`
  background-color: #f3f4f6;
  width: 10rem;
  height: 12rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

export const CardImage = styled.figure`
  margin: 0;
  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.375rem;
  }
`;

export const CardDetails = styled.div`
  text-align: right;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardBody = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
`;

export const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
`;

export const CardDescription = styled.p``;
