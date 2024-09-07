import styled from "styled-components";

export const CardContainer = styled.div`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  padding: 0.5rem;
  border: 2px solid #285d90;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
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
  color: #d1d5db;
`;

export const CardInfoColumnUpgradeValue = styled.p`
  font-size: 0.8rem;
  color: white;
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
`;

export const CardContent = styled.div`
  padding: 0.5rem;
  padding-top: 0.2rem;
`;

export const CardDescription = styled.p`
  font-size: 0.8rem;
  color: #d1d5db;
`;

export const CardRequirement = styled.div`
  margin-top: 1rem;
  color: #1e90ff;
  text-shadow: 0 0 2px #1e90ff, 0 0 8px #1e90ff;

  &:hover {
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  @keyframes glow {
    0% {
      text-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff,
        0 0 8px #1e90ff;
    }
    100% {
      text-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff,
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

export const Button = styled.button`
  padding: 0.5rem;
  margin: 0.8rem;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:disabled {
    background-color: grey;
  }
`;

export const LockedButton = styled.button`
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.8rem;
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

  &:disabled {
    background-color: grey;
  }
`;

export const NeonButton = styled(Button)`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.8rem;
  border: 2px solid #1e90ff;
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
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;

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

export const NeonRedButton = styled(NeonButton)`
  background-color: rgb(39 39 42) !important;
  color: #white;
  border: 2px solid #ff1e1e;
  box-shadow: 0 0 2px #ff1e1e, 0 0 6px #ff1e1e;

  &:hover {
    background-color: rgb(24 24 27);
    animation: redGlow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:active {
    animation: redGlow 1.5s infinite alternate, pulse 2s infinite;
  }

  @keyframes redGlow {
    0% {
      box-shadow: 0 0 2px #ff1e1e, 0 0 4px #ff1e1e, 0 0 6px #ff1e1e,
        0 0 8px #ff1e1e;
    }
    100% {
      box-shadow: 0 0 8px #ff1e1e, 0 0 12px #ff1e1e, 0 0 16px #ff1e1e,
        0 0 20px #ff1e1e;
    }
  }
`;

export const CardCost = styled.span`
  font-size: 0.8rem;
  color: #32cd32;
`;
