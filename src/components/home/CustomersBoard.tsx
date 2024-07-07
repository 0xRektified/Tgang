import React from "react";
import styled from "styled-components";
import { Product } from "../interfaces/user.interface";
import { FlexBoxRow } from "../styled/globalStyled";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";
import { EProductIcon } from "../interfaces/product.interface";
import { ICustomerInfo } from "../interfaces/customer.interface";

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
  padding: 0.4rem;
  margin: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  min-width: 100px;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #cbd5e0;
  font-size: 0.9rem;
`;

const HeaderRow = styled(FlexBoxRow)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

interface CustomersBoardProps {
  products: Product[];
  customers: ICustomerInfo[];
  transaction: Transaction | null;
  waitingCustomersCount: number;
}

export const CustomersBoard: React.FC<CustomersBoardProps> = ({
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
          {customers.length > 0 ? (
            customers.map((customer, index) => {
              const { product, quantity, emoji } = customer;
              const productIcon =
                EProductIcon[product.name as keyof typeof EProductIcon];
              return (
                <CustomerRow key={index}>
                  <CustomerInfo>
                    <span>
                      {emoji} {productIcon}
                    </span>
                    <span>
                      {quantity} {product.name}
                    </span>
                  </CustomerInfo>
                </CustomerRow>
              );
            })
          ) : (
            <CustomerRow>
              <CustomerInfo>
                <span>it's night time no more customers</span>
                <span>...</span>
                <span>Please wait</span>
              </CustomerInfo>
            </CustomerRow>
          )}
        </CustomerListContainer>
      </ScrollableContainer>
    </>
  );
};
