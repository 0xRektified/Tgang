import styled from "styled-components";

export const CardContainer = styled.div`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  padding: 0.5rem;
  border: 2px solid #285d90;
  display: flex;
  gap: 0.5rem;
`;

export const CardLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
`;

export const CardImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const CardImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

export const CardButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const CardRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.2rem;
  margin-top: auto;
`;

export const CardCost = styled.div`
  font-size: 0.9rem;
  color: #32cd32;
  text-align: center;
  width: 100%;
  padding-right: 1px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.5rem;
  padding-bottom: 0.2rem;
`;

export const CardDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CardInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const InfoItemContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

export const InfoLabel = styled.span`
  font-weight: bold;
  color: #d1d5db;
  margin-right: 0.5rem;
`;

export const InfoValue = styled.span<{ isCost?: boolean }>`
  color: ${(props) => (props.isCost ? "#32cd32" : "white")};
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

export const CardContent = styled.div`
  padding: 0.5rem;
  padding-top: 0.2rem;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #d1d5db;
`;

export const CardRequirement = styled.div`
  margin-bottom: 1rem;
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

export const RequirementText = styled.p`
  color: white;
  text-shadow: 0 0 2px red;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 5px;
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
export const SmallButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  width: 100%;
`;

export const SmallNeonButton = styled(NeonButton)`
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  width: 100%;
`;
