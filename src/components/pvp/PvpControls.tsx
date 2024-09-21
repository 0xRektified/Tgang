import React from "react";
import styled from "styled-components";
import { NeonButton } from "../styled/cardStyled";
import { CombatState } from "./Pvp";

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

interface PvpControlsProps {
  combatState: CombatState;
  onButtonClick: () => void;
  onCollect: () => void;
  isWinner: boolean;
}

export const PvpControls: React.FC<PvpControlsProps> = ({
  combatState,
  onButtonClick,
  onCollect,
  isWinner,
}) => {
  const getButtonText = () => {
    switch (combatState) {
      case "searching": return "Searching...";
      case "fighting": return "Attack";
      case "ready": return "Start";
      case "result": return isWinner ? "Collect & Return to Main Menu" : "Return to Main Menu";
      default: return "Search for Opponent";
    }
  };

  const handleClick = () => {
    if (combatState === "result" && isWinner) {
      onCollect();
    } else {
      onButtonClick();
    }
  };

  return (
    <ControlsContainer>
      <NeonButton
        onClick={handleClick}
        disabled={combatState === "searching"}
        className={combatState === "searching" ? "disabled" : ""}
      >
        {getButtonText()}
      </NeonButton>
    </ControlsContainer>
  );
};