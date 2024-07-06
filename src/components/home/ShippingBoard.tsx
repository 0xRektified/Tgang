import React from "react";
import styled from "styled-components";
import { Product } from "../interfaces/user.interface";

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

const CardContainer = styled.div``;

// display: flex;
// flex-direction: column;
// gap: 0.2rem;

const ProductRow = styled.div`
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

const CustomerListContainer = styled.div`
  margin-top: 1rem;
`;

const CustomerRow = styled.div`
  display: flex;
  align-items: center;
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #cbd5e0;
  font-size: 1rem;
`;

interface Customer {
  [key: string]: {
    quantity: number;
    emoji: string;
  };
}

interface ShippingBoardProps {
  products: Product[];
  customers: Customer[];
}

export const ShippingBoard: React.FC<ShippingBoardProps> = ({
  products,
  customers,
}) => {
  const totalWeight = 10;
  const totalCapacity = 200;

  console.log("ShippingBoard products", products);

  return (
    <div>
      <CardContainer>
        {products.map((product) => (
          <ProductRow key={product.name}>
            <ProductName>{product.name}</ProductName>
            <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
          </ProductRow>
        ))}
      </CardContainer>
      <ScrollableContainer>
        <CustomerListContainer>
          {customers.map((customer, index) => {
            const productName = Object.keys(customer)[0];
            const { quantity, emoji } = customer[productName];
            return (
              <CustomerRow key={index}>
                <CustomerInfo>
                  <span>{emoji}</span>
                  <span>{quantity}</span>
                  <span>{productName}</span>
                </CustomerInfo>
              </CustomerRow>
            );
          })}
        </CustomerListContainer>
      </ScrollableContainer>
    </div>
  );
};
