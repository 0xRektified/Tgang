import React from "react";
import styled from "styled-components";
import { useCountdown } from "../hooks/useCountDown";

const TimerContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

const TimerText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const TimerIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

interface TimerComponentProps {
  nextUpgrade?: Date;
  onExpired?: () => void;
}

const TimerComponent: React.FC<TimerComponentProps> = ({
  nextUpgrade,
  onExpired,
}) => {
  const { formattedCountdown, isExpired } = useCountdown(nextUpgrade);

  React.useEffect(() => {
    if (isExpired && onExpired) {
      onExpired();
    }
  }, [isExpired, onExpired]);

  if (isExpired) {
    return null;
  }

  return (
    <TimerContainer>
      <TimerIcon>🕒</TimerIcon>
      <TimerText>{formattedCountdown}</TimerText>
    </TimerContainer>
  );
};

export default TimerComponent;
