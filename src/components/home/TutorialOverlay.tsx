import React from "react";
import { useTutorial } from "../../hooks/useTutorial";
import styled from "styled-components";

const TutorialMessage = styled.div`
  transform: translateY(-50%);
  color: white;
  font-size: 1.2rem;
  z-index: 20;
  pointer-events: none;
  background-color: #1a1a1a;
`;

const SkipButton = styled.button`
  background: grey;
  color: black;
  border-radius: 6px;
  padding: 0.6em 1em;
  font-size: 0.7em !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.8rem auto;
  width: 10em;
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(116, 185, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0);
    }
  }
  @media (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em 0.8em;
  }
  display: block;
`;

const StyledSkipButton = styled(SkipButton)`
  position: absolute;
  top: 25em;
  right: 20px;
  background-color: grey;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
`;

interface TutorialOverlayProps {
  children: React.ReactNode;
  step: number;
  tutorial: ReturnType<typeof useTutorial>;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  children,
  step,
  tutorial,
}) => {
  const handleSkipTutorial = () => {
    tutorial.setTutorialCompleted(true);
    tutorial.tutorialCompleted = true;
  };

  if (tutorial.tutorialCompleted || tutorial.tutorialStep !== step) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: "relative" }}>
      <TutorialMessage>
        CLICK THE "BUY" BUTTON TO BUY YOUR FIRST PRODUCT 👇
      </TutorialMessage>
      <StyledSkipButton onClick={handleSkipTutorial}>
        Skip Tutorial
      </StyledSkipButton>
      {children}
    </div>
  );
};
