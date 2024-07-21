import styled from "styled-components";

export const CardContainer = styled.div<{ locked?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ locked }) =>
    locked ? "rgba(128, 128, 128, 15%)" : "#10346e3d"};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #e4e4e7;
  margin-bottom: 1rem;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardContent = styled.div`
  margin-top: 1rem;
`;

export const CardTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

export const CardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 1rem;
`;

export const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

export const CardInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CardRequirement = styled.p`
  font-size: 0.8rem;
  color: #ff6b6b;
`;

export const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 1px #eab308, 0 0 5px #eab308, 0 0 8px #eab308,
    0 0 10px #eab308;
  border: 2px solid #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease, transform 0.1s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Button = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 2px solid;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }

  &:active {
    transform: scale(0.95);
  }
`;
