import styled from "styled-components";

export const CardContainer = styled.div`
  background-color: #8989893d;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  padding-bottom: 0.2rem;
`;

export const CardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
`;

export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

export const CardInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardInfoColumnText = styled.p`
  font-size: 0.8rem;
`;
export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const CardContent = styled.div`
  padding: 1rem;
  padding-top: 0.2rem;
`;

export const CardDescription = styled.p`
  font-size: 1rem;
  margin-top: 0.5rem;
`;

export const CardRequirement = styled.div`
  margin-top: 1rem;
  color: red;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:disabled {
    background-color: grey;
  }
`;

export const NeonButton = styled(Button)`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 1rem 0rem;
  border: 1px solid #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  width: 8em;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 1px #eab308, 0 0 5px #eab308, 0 0 8px #eab308,
    0 0 10px #eab308;

  &:hover {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:active {
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &.disabled {
    background-color: rgb(99 99 99) !important;
    border: none;
  }
`;
