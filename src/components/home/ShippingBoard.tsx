import React from "react";
import styled from "styled-components";
import { Product } from "../interfaces/user.interface";
import { FlexBoxRow } from "../styled/globalStyled";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";
import { EProductIcon } from "../interfaces/product.interface";

const ScrollableContainer = styled.div`
  max-height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;

  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d3748;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 4px;
  }
`;

const CustomerListContainer = styled.div`
  display: flex;
  overflow-x: auto;
  max-width: 100%;
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

const CustomerRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  min-width: 100px;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #cbd5e0;
  font-size: 1rem;
`;

const HeaderRow = styled(FlexBoxRow)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

interface ShippingBoardProps {
  products: Product[];
  customers: any[];
  transaction: Transaction | null;
  waitingCustomersCount: number;
}

export const ShippingBoard: React.FC<ShippingBoardProps> = ({
  products,
  customers,
  transaction,
  waitingCustomersCount,
}) => {
  return (
    <>
      <HeaderRow>
        <LastTransaction
          transaction={transaction}
          waitingCustomersCount={waitingCustomersCount}
        />
      </HeaderRow>
      <ScrollableContainer>
        <CustomerListContainer>
          {customers.map((customer, index) => {
            const productName = Object.keys(customer)[0];
            const { quantity, emoji } = customer[productName];
            const productIcon =
              EProductIcon[productName as keyof typeof EProductIcon];
            return (
              <CustomerRow key={index}>
                <CustomerInfo>
                  <span>
                    {emoji} {productIcon}
                  </span>
                  <span>
                    {quantity} {productName}
                  </span>
                </CustomerInfo>
              </CustomerRow>
            );
          })}
        </CustomerListContainer>
      </ScrollableContainer>
    </>
  );
};
