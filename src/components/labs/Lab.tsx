import React, { useState } from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import { HorizontalSpacing } from "../styled/globalStyled";
import LabModal from "./LabModal";
import PurchasedLab from "./PurchasedLab";

const LabContainer = styled.div`
  background-color: #1c1c1e;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const ProductionRecap = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const ProductionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ProductionItem = styled.div`
  padding: 0.2rem;
  background-color: #374151;
  border-radius: 0.375rem;
  text-align: center;
  color: white;
`;

const LabsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const LabItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  border-radius: 0.375rem;
  margin-top: 1em;
`;

const AddLabButton = styled.button`
  width: 5em;
  height: 100%;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #16a34a1f;
  border-radius: 0.375rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #15803d;
  }
`;

interface LabProps {
  labs: ILab[];
}

export const Lab: React.FC<LabProps> = ({ labs }) => {
  const [isLabModalOpen, setIsLabModalOpen] = useState<boolean>(false);

  const handleOpenLabModal = () => {
    setIsLabModalOpen(true);
  };

  const handleCloseLabModal = () => {
    setIsLabModalOpen(false);
  };

  const handleSelectLab = (lab: ILab) => {
    console.log("Selected Lab:", lab);
    setIsLabModalOpen(false);
  };

  const handleUpdateProduction = (lab: ILab) => {
    console.log("Update Production for:", lab.productType);
  };

  const handleUpdateCapacity = (lab: ILab) => {
    console.log("Update Capacity for:", lab.productType);
  };

  return (
    <LabContainer>
      <ProductionRecap>
        <h2 className="text-lg font-bold">Current Production</h2>
        <ProductionGrid>
          <ProductionItem>Weed 100/H</ProductionItem>
          <ProductionItem>Coke 0/H</ProductionItem>
          <ProductionItem>Meth 100/H</ProductionItem>
          <ProductionItem>Heroin 100/H</ProductionItem>
          <ProductionItem>Mushroom 100/H</ProductionItem>
          <ProductionItem>Crack 100/H</ProductionItem>
        </ProductionGrid>
      </ProductionRecap>
      <div className="divider"></div>
      <LabsGrid>
        <LabItem>
          <AddLabButton onClick={handleOpenLabModal}>+</AddLabButton>
        </LabItem>
        {labs.map((lab) => (
          <PurchasedLab
            key={lab.productType}
            lab={lab}
            onUpdateProduction={() => handleUpdateProduction(lab)}
            onUpdateCapacity={() => handleUpdateCapacity(lab)}
          />
        ))}
      </LabsGrid>
      {isLabModalOpen && (
        <LabModal
          labs={labs}
          onClose={handleCloseLabModal}
          onSelectLab={handleSelectLab}
        />
      )}
    </LabContainer>
  );
};

export default Lab;
