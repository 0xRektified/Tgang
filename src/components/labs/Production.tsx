import React from "react";
import styled, { keyframes, css } from "styled-components";
import "tailwindcss/tailwind.css";
import { EProduct, EProductIcon } from "../interfaces/product.interface";

const Amount = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
`;

const ProductionPerHour = styled.div`
  font-size: 0.9rem;
  color: #4caf50;
`;

const ProductionPanel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 5px;
  border-radius: 12px;
  background-color: #242627;
  border: 2px solid #1e90ff;
  box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
`;

const ProductionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: #242627;
  color: white;
  border: 2px solid "#374151";
  &:hover {
    transform: translateY(-2px);
  }
  min-width: 3em;
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
    <ProductionPanel>
      {Object.values(EProduct).map((product) => (
        <ProductionColumn>
          <Amount>
            {currentAmount[product as keyof typeof currentAmount]}
          </Amount>
          {EProductIcon[product as keyof typeof EProductIcon]}
          <ProductionPerHour>
            +{productionPerHour[product as keyof typeof productionPerHour]}/h
          </ProductionPerHour>
        </ProductionColumn>
      ))}
    </ProductionPanel>
  );
};

export default CombinedProduction;
