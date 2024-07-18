import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { EProduct, EProductIcon } from "../interfaces/product.interface";

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

interface ProductionProps {
  production: Record<EProduct, number>;
}

const Production: React.FC<ProductionProps> = ({ production }) => {
  return (
    <ProductionGrid>
      <ProductionItem>
        {EProductIcon[EProduct.WEED as keyof typeof EProductIcon]}
        {production[EProduct.WEED]} Weed/h
      </ProductionItem>
      <ProductionItem>
        {EProductIcon[EProduct.COCAINE as keyof typeof EProductIcon]}
        {production[EProduct.COCAINE]} Cocaine/h
      </ProductionItem>
      <ProductionItem>
        {EProductIcon[EProduct.METH as keyof typeof EProductIcon]}
        {production[EProduct.METH]} Meth/h
      </ProductionItem>
      <ProductionItem>
        {EProductIcon[EProduct.HEROIN as keyof typeof EProductIcon]}
        {production[EProduct.HEROIN]} Heroin/h
      </ProductionItem>
      <ProductionItem>
        {EProductIcon[EProduct.LSD as keyof typeof EProductIcon]}
        {production[EProduct.LSD]} LSD/h
      </ProductionItem>
      <ProductionItem>
        {EProductIcon[EProduct.MDMA as keyof typeof EProductIcon]}
        {production[EProduct.MDMA]} MDMA/h
      </ProductionItem>
    </ProductionGrid>
  );
};

export default Production;
