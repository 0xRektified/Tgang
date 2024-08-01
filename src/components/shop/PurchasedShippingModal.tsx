import React from "react";
import { LuPackagePlus } from "react-icons/lu";
import { FaShippingFast } from "react-icons/fa";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo, IUserShipping } from "../interfaces/user.interface";
import { useUpgradeShippingCapacity } from "../../hooks/useUpgradeShippingCapacity";
import { useUpgradeShippingShippingTime } from "../../hooks/useUpgradeShippingTime";
import { CardTitle, NeonButton } from "../styled/cardStyled";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled(CardTitle)`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledNeonButton = styled(NeonButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  & > svg {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef44449c;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #dc2626;
  }
`;

export const formatSeconds = (time: number) => {
  const hours = Math.floor((time / (60 * 60)) % 24);
  const minutes = Math.floor((time / 60) % 60);
  const seconds = Math.floor(time % 60);

  return { hours, minutes, seconds };
};

interface PurchasedShippingModalProps {
  shipping: IUserShipping;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const PurchasedShippingModal: React.FC<PurchasedShippingModalProps> = ({
  shipping,
  onClose,
  setUserInfo,
}) => {
  const { upgradeShippingCapacity } = useUpgradeShippingCapacity();
  const { upgradeShippingShippingTime } = useUpgradeShippingShippingTime();

  const upgradeCapacity = () => {
    upgradeShippingCapacity(shipping.method, setUserInfo);
    onClose();
  };

  const upgradeShippingTime = () => {
    upgradeShippingShippingTime(shipping.method, setUserInfo);
    onClose();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const upgradeCapacityDiff = shipping.upgradeCapacity! - shipping.capacity!;
  const upgradeShippingTimeDiff = Math.abs(
    shipping.upgradeShippingTime! - shipping.shippingTime!
  );
  const formatedShippingSeconds = formatSeconds(upgradeShippingTimeDiff);
  // format a string to display the time in the format HH:MM:SS
  const formatedShippingTime = `${formatedShippingSeconds.hours}:${formatedShippingSeconds.minutes}:${formatedShippingSeconds.seconds}`;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>Upgrade {shipping.method}</ModalHeader>
        <ButtonContainer>
          <StyledNeonButton onClick={upgradeCapacity}>
            Capacity +{upgradeCapacityDiff}
            <LuPackagePlus /> {formatPrice(shipping.upgradeCapacityPrice || 0)}
          </StyledNeonButton>
          <StyledNeonButton onClick={upgradeShippingTime}>
            ShippingTime -{formatedShippingTime}
            <FaShippingFast />{" "}
            {formatPrice(shipping.upgradeShippingTimePrice || 0)}
          </StyledNeonButton>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default PurchasedShippingModal;
