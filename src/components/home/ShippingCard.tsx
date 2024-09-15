import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CardContainer } from "./styles/shipping.css";
import { IShippingMethod } from "../interfaces/shipping.interface";
import { IUserShipping } from "../interfaces/user.interface";
import { Duration } from "date-fns";

const ShippingCardMiddle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  flex: 1;
  margin: 0 1rem;
`;

const ShippingCardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const NeonButton = styled.button`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
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
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;

  &:hover {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:active {
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:disabled {
    background-color: rgb(99 99 99) !important;
    border: none;
    cursor: not-allowed;
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

const ShipNowText = styled.div`
  color: white;
  font-weight: bold;
  font-size: 1.1em;
  text-shadow: 0 0 5px #1e90ff, 0 0 10px #1e90ff;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ShippingCardContainer = styled(CardContainer)<{ locked: boolean }>`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  border: 2px solid ${(props) => (props.locked ? "#4a4a4a" : "#285d90")};
  display: flex;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${(props) =>
      props.locked ? "none" : "0 0 8px #1e90ff, 0 0 12px #1e90ff"};
  }
`;

const ShippingCardImage = styled.img`
  border-radius: 0.8rem;
  width: 50px;
  height: 50px;
`;

const ShippingCardTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ShippingCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
`;

const ShippingCardLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoText = styled.div`
  font-size: 0.8rem;
  color: #a0aec0;
  margin: 0;
  color: white;
`;

const PriceText = styled.span`
  color: #4ade80;
`;

const WhiteText = styled.span`
  color: white;
`;

export const ShippingCard: React.FC<{
  method: IShippingMethod;
  userShipping: IUserShipping | undefined;
  locked: boolean;
  handleUnlockClick: () => void;
  handleOpenModal: (userShipping: IUserShipping) => void;
}> = ({ method, userShipping, locked, handleUnlockClick, handleOpenModal }) => {
  const [countdown, setCountdown] = useState<Duration>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const shipmentInProgress = (nextShipment: Date) => {
    return nextShipment.getTime() > new Date().getTime();
  };

  const calculateCountdown = (nextShipment: Date) => {
    const now = new Date().getTime();
    const nextShipmentTime = nextShipment.getTime();
    if (nextShipmentTime < now) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const duration = {
      hours: Math.floor(
        (nextShipment.getTime() - new Date().getTime()) / (1000 * 60 * 60),
      ),
      minutes:
        Math.floor(
          (nextShipment.getTime() - new Date().getTime()) / (1000 * 60),
        ) % 60,
      seconds:
        Math.floor((nextShipment.getTime() - new Date().getTime()) / 1000) % 60,
    };
    return duration;
  };

  const formatCountdown = (countdown: Duration): string => {
    const { hours, minutes, seconds } = countdown;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      return "Ship now";
    }

    const parts = [];
    if (hours && hours > 0) parts.push(`${hours}h`);
    if (minutes && minutes > 0) parts.push(`${minutes}m`);
    if (seconds && seconds > 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  const renderLockedInfo = (method: IShippingMethod) => (
    <ShippingCardMiddle>
      <ShippingCardMiddle>
        <InfoText>
          Price: <PriceText>${method.basePrice}</PriceText>
        </InfoText>
        <InfoText>Capacity:{method.baseCapacity}</InfoText>
        <InfoText>Shipping Time: {method.baseShippingTime}</InfoText>
      </ShippingCardMiddle>
    </ShippingCardMiddle>
  );

  useEffect(() => {
    if (userShipping) {
      const interval = setInterval(() => {
        const newCountdown = calculateCountdown(
          new Date(userShipping.nextShipment),
        );
        setCountdown(newCountdown);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userShipping]);

  const renderShippingButton = () => {
    if (locked) {
      return <NeonButton onClick={handleUnlockClick}>Unlock</NeonButton>;
    } else if (
      userShipping &&
      shipmentInProgress(new Date(userShipping.nextShipment))
    ) {
      return <NeonButton disabled>In progress</NeonButton>;
    } else if (userShipping) {
      return (
        <NeonButton onClick={() => handleOpenModal(userShipping)}>
          Ship up to {userShipping.capacity}
        </NeonButton>
      );
    }
    return null;
  };

  return (
    <ShippingCardContainer locked={locked}>
      <ShippingCardContent>
        <ShippingCardLeft>
          <ShippingCardTitle>{method.title}</ShippingCardTitle>
          <ShippingCardImage src={method.image} alt={method.title} />
        </ShippingCardLeft>
        {locked ? (
          renderLockedInfo(method)
        ) : (
          <ShippingCardMiddle>
            {userShipping && (
              <div>
                {formatCountdown(countdown) === "Ship now" ? (
                  <ShipNowText>Next shipment Ready</ShipNowText>
                ) : (
                  <div>
                    <div>Next shipment</div>
                    <div>{formatCountdown(countdown)}</div>
                  </div>
                )}
              </div>
            )}
          </ShippingCardMiddle>
        )}
        <ShippingCardRight>{renderShippingButton()}</ShippingCardRight>
      </ShippingCardContent>
    </ShippingCardContainer>
  );
};
