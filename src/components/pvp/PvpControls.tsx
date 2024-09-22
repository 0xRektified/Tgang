import React from "react";
import styled from "styled-components";
import { NeonButton } from "../styled/cardStyled";

// Update the CombatState type
type CombatState = "idle" | "result" | "searching" | "ready" | "fighting";

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

interface PvpControlsProps {
  combatState: CombatState;
  onButtonClick: () => void;
  isWinner: boolean;
}

export const PvpControls: React.FC<PvpControlsProps> = ({
  combatState,
  onButtonClick,
  isWinner,
}) => {
  const getButtonText = () => {
    switch (combatState) {
      case "fighting":
        return "Attack";
      case "ready":
        return "Start Fight";
      case "result":
        return "Collect & Return to Main Menu";
      default:
        return "";
    }
  };

  const handleClick = () => {
    onButtonClick();
  };

  return !isWinner && combatState !== "idle" ? (
    <ControlsContainer>
      <NeonButton
        onClick={handleClick}
        // disabled={combatState === "idle"}
        // className={combatState === "idle" ? "disabled" : ""}
      >
        {getButtonText()}
      </NeonButton>
    </ControlsContainer>
  ) : null;
};
