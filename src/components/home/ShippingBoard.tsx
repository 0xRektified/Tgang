import React from "react";
import styled from "styled-components";
import { Product } from "../interfaces/user.interface";

interface ShippingBoardProps {
  products: Product[];
}

const ScrollableContainer = styled.div`
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d3748;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 4px;
  }
`;

const CarryInfoContainer = styled.div`
  background-color: #1a202c;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #cbd5e0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: #f6e05e;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  &.disabled {
    background-color: #1a202c;
    cursor: not-allowed;

    &:hover {
      transform: none;
    }

    div {
      color: #718096;
    }

    button {
      background-color: #2d3748;
      cursor: not-allowed;

      &:hover {
        background-color: #2d3748;
      }
    }
  }
`;

const ProductName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #cbd5e0;
  margin-right: 1rem;
`;

const ProductQuantity = styled.div`
  font-size: 1rem;
  color: #a0aec0;
  margin-right: 1rem;
`;

export const ShippingBoard: React.FC<ShippingBoardProps> = ({ products }) => {
  const totalWeight = 10;
  const totalCapacity = 200;

  console.log("ShippingBoard products", products);

  return (
    <div>
      <CarryInfoContainer>
        <CarryInfoContainer>
          Total Carry: <InfoValue>{totalWeight}</InfoValue> /{" "}
          <InfoValue>{totalCapacity}</InfoValue>
        </CarryInfoContainer>
      </CarryInfoContainer>
      <ScrollableContainer>
        <CardContainer>
          {products.map((product) => (
            <>
              <ProductRow
                key={product.name}
                className={product.quantity === 0 ? "disabled" : ""}
              >
                <ProductName>{product.name}</ProductName>
                <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
              </ProductRow>
            </>
          ))}
        </CardContainer>
      </ScrollableContainer>
    </div>
  );
};
