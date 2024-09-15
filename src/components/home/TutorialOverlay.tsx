import React from "react";
import { SkipButton } from "./Home";
import { useTutorial } from "../../hooks/useTutorial";

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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <SkipButton
        onClick={handleSkipTutorial}
        style={{
          position: "absolute",
          bottom: "7em",
          right: "15em",
          zIndex: 20,
          backgroundColor: "grey",
          color: "black",
          padding: "5px 10px",
          borderRadius: "5px",
        }}
      >
        Skip Tutorial
      </SkipButton>
      {children}
    </div>
  );
};
