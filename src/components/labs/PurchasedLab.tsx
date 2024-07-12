import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";

const PurchasedLabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
`;

const LabImage = styled.img`
  height: 4rem;
  width: 4rem;
`;

const LabInfo = styled.div`
  text-align: center;
  color: white;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const UpdateButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background-color: #2563eb;
  border-radius: 0.25rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

interface PurchasedLabProps {
  lab: ILab;
  onUpdateProduction: () => void;
  onUpdateCapacity: () => void;
}

const PurchasedLab: React.FC<PurchasedLabProps> = ({
  lab,
  onUpdateProduction,
  onUpdateCapacity,
}) => {
  return (
    <PurchasedLabContainer>
      <LabImage src={lab.image} alt={lab.productType} />
      <LabInfo>{lab.productType}</LabInfo>
      <ProgressContainer>
        <div className="flex items-center">
          <progress
            className="progress progress-accent w-56"
            value={lab.productionLevel * 10}
            max="100"
          ></progress>
          <UpdateButton onClick={onUpdateProduction}>+</UpdateButton>
        </div>
        <div className="flex items-center mt-2">
          <progress
            className="progress progress-accent w-56"
            value={lab.capacityLevel * 10}
            max="100"
          ></progress>
          <UpdateButton onClick={onUpdateCapacity}>+</UpdateButton>
        </div>
      </ProgressContainer>
    </PurchasedLabContainer>
  );
};

export default PurchasedLab;
