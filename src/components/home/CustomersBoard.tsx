import React from "react";
import styled from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";

const CustomerBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 6em;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  padding: 0 !important;
`;

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

interface CustomersBoardProps {
  customers: string[];
  transaction: Transaction | null;
}

export const getRandomEmoji = () => {
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export const CustomersBoard: React.FC<CustomersBoardProps> = ({
  customers,
  transaction,
}) => {
  return (
    <CustomerBoardContainer className="bg-zinc-800">
      <HeaderRow>
        <LastTransaction
          transaction={transaction}
          waitingCustomersCount={customers.length}
        />
      </HeaderRow>
      <ScrollableContainer>
        <CustomerListContainer>
          {customers.length > 0 ? (
            customers
              .slice(0, 32)
              .map((emoji, index) => (
                <CustomerEmoji key={index}>{emoji}</CustomerEmoji>
              ))
          ) : (
            <CustomerEmoji>
              it's night time no more customers... Please wait
            </CustomerEmoji>
          )}
        </CustomerListContainer>
      </ScrollableContainer>
    </CustomerBoardContainer>
  );
};
