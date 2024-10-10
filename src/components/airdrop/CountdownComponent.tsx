import React from "react";
import styled from "styled-components";
import { BsClock } from "react-icons/bs";
import { useCountdown } from "../../hooks/useCountDown";

const CountdownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

interface CountdownComponentProps {
  lastRobbery: Date | string | undefined;
}

const CountdownComponent: React.FC<CountdownComponentProps> = ({ lastRobbery }) => {
  const targetDate = React.useMemo(() => {
    if (!lastRobbery) return undefined;
    
    const robberyDate = typeof lastRobbery === 'string' ? new Date(lastRobbery) : lastRobbery;
    
    if (!(robberyDate instanceof Date) || isNaN(robberyDate.getTime())) {
      console.error('Invalid lastRobbery date:', lastRobbery);
      return undefined;
    }
    
    return new Date(robberyDate.getTime() + 24 * 60 * 60 * 1000);
  }, [lastRobbery]);

  const { formattedCountdown, isExpired } = useCountdown(targetDate);

  if (!targetDate) return null;

  return (
    <CountdownWrapper>
      <BsClock />
      <span className="countdown font-mono text-1xl">
        {formattedCountdown}
      </span>
    </CountdownWrapper>
  );
};

export default CountdownComponent;