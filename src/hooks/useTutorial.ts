import { useState } from 'react';

export function useTutorial() {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const onTutorialProgress = () => {
    setTutorialStep((prevStep) => prevStep + 1);
    if (tutorialStep >= 3) {
      setTutorialCompleted(true);
    }
  };

  const handleTutorialClick = () => {
    if (tutorialStep === 0) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      if (newClickCount >= 10) {
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
  };
}