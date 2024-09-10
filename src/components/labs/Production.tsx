import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { EProduct, EProductIcon } from "../interfaces/product.interface";

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

const CombinedProductionItem = styled.div`
  padding: 0.2rem;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
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
          {EProductIcon[product as keyof typeof EProductIcon]}
          <Amount>
            {currentAmount[product as keyof typeof currentAmount]}
          </Amount>
          <ProductionPerHour>
            +{productionPerHour[product as keyof typeof productionPerHour]}/h
          </ProductionPerHour>
        </CombinedProductionItem>
      ))}
    </CombinedProductionGrid>
  );
};

export default CombinedProduction;
