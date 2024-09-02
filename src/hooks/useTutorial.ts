import { useState } from "react";

export function useTutorial() {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const onTutorialProgress = () => {
    setTutorialStep((prevStep) => {
      const newStep = prevStep + 1;
      if (newStep > 5) { // Updated to 5 steps
        setTutorialCompleted(true);
      }
      return newStep;
    });
  };

  const handleTutorialClick = () => {
    if (tutorialStep === 0) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      if (newClickCount >= 5) {
        onTutorialProgress();
        setClickCount(0);
      }
    }
  };

  return {
    tutorialStep,
    tutorialCompleted,
    clickCount,
    onTutorialProgress,
    handleTutorialClick,
    setTutorialCompleted,
  };
}
