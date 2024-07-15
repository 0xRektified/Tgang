import React from "react";
import styled from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";

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
  flex-wrap: wrap;
  justify-content: center;
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

const CustomerEmoji = styled.span`
  font-size: 0.8rem;
  margin: 0.2rem;
`;

const HeaderRow = styled(FlexBoxRow)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

interface CustomersBoardProps {
  customers: number;
  transaction: Transaction | null;
}

const emojiList = [
  "👶",
  "🧒",
  "👦",
  "👧",
  "🧑",
  "👱",
  "👨",
  "🧔",
  "👶🏿",
  "🧒🏿",
  "👦🏿",
  "👧🏿",
  "🧑🏿",
  "👱🏿",
  "👨🏿",
  "🧔🏿",
  "👶🏻",
  "🧒🏻",
  "👦🏻",
  "👧🏻",
  "🧑🏻",
  "👱🏻",
  "👨🏻",
  "🧔🏻",
  "👶🏽",
  "🧒🏽",
  "👦🏽",
  "👧🏽",
  "🧑🏽",
  "👱🏽",
  "👨🏽",
  "🧔🏽",
  "👶🏾",
  "🧒🏾",
  "👦🏾",
  "👧🏾",
  "🧑🏾",
  "👱🏾",
  "👨🏾",
  "🧔🏾",
];

export const CustomersBoard: React.FC<CustomersBoardProps> = ({
  customers,
  transaction,
}) => {
  return (
    <>
      <HeaderRow>
        <LastTransaction
          transaction={transaction}
          waitingCustomersCount={customers}
        />
      </HeaderRow>
      <ScrollableContainer>
        <CustomerListContainer>
          {customers > 0 ? (
            Array.from({ length: Math.min(customers, 40) }, (_, index) => (
              <CustomerEmoji key={index}>
                {emojiList[index % emojiList.length]}
              </CustomerEmoji>
            ))
          ) : (
            <CustomerEmoji>
              it's night time no more customers... Please wait
            </CustomerEmoji>
          )}
        </CustomerListContainer>
      </ScrollableContainer>
    </>
  );
};
