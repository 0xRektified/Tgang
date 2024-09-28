import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsClock } from "react-icons/bs";

const CountdownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const calculateCountdown = (time: Date) => {
  const now = new Date().getTime();
  const timeInMillis = new Date(time).getTime();
  const timeLeft = 24 * 60 * 60 * 1000 - (now - timeInMillis);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { hours, minutes, seconds, timeLeft };
};

interface CountdownComponentProps {
  lastRobbery: Date | undefined;
}

const CountdownComponent: React.FC<CountdownComponentProps> = ({ lastRobbery }) => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (lastRobbery) {
      const interval = setInterval(() => {
        const newCountdown = calculateCountdown(lastRobbery);
        if (newCountdown.timeLeft > 0) {
          setCountdown(newCountdown);
          setIsExpired(false);
        } else {
          setCountdown(calculateCountdown(new Date(lastRobbery.getTime() + 24 * 60 * 60 * 1000)));
          setIsExpired(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastRobbery]);

  if (!lastRobbery) return null;

  return (
    <CountdownWrapper>
      <BsClock />
      <span className="countdown font-mono text-1xl">
        <span style={{ "--value": countdown.hours } as React.CSSProperties}></span>h
        <span style={{ "--value": countdown.minutes } as React.CSSProperties}></span>m
        <span style={{ "--value": countdown.seconds } as React.CSSProperties}></span>s
      </span>
    </CountdownWrapper>
  );
};

export default CountdownComponent;