import React from "react";
import styled, { keyframes, css } from "styled-components";
import "tailwindcss/tailwind.css";
import { EProduct, EProductIcon } from "../interfaces/product.interface";

// Add these new animations
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1px);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;
  }
  100% {
    box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff, 0 0 20px #1e90ff;
  }
`;

const CombinedProductionGrid = styled.div`
  display: grid;
  background-color: #10346e3d;
  border-radius: 0.375rem;

  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

// Update CombinedProductionItem
const CombinedProductionItem = styled.div`
  padding: 5px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Amount = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
`;

const ProductionPerHour = styled.div`
  font-size: 0.9rem;
  color: #4caf50;
`;

interface CombinedProductionProps {
  currentAmount: Record<EProduct, number>;
  productionPerHour: Record<EProduct, number>;
}

const CombinedProduction: React.FC<CombinedProductionProps> = ({
  currentAmount,
  productionPerHour,
}) => {
  return (
    <CombinedProductionGrid>
      {Object.values(EProduct).map((product) => (
        <CombinedProductionItem key={product}>
          <Amount>
            {currentAmount[product as keyof typeof currentAmount]}
          </Amount>
          {EProductIcon[product as keyof typeof EProductIcon]}

          <ProductionPerHour>
            +{productionPerHour[product as keyof typeof productionPerHour]}/h
          </ProductionPerHour>
        </CombinedProductionItem>
      ))}
    </CombinedProductionGrid>
  );
};

export default CombinedProduction;
