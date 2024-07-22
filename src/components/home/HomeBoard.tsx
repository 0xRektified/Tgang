import React from "react";
import styled from "styled-components";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";
import {
  FlexBoxCol,
  FlexBoxColNoGap,
  FlexBoxRow,
} from "../styled/globalStyled";

const CustomerBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 4em;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  padding: 0 !important;
`;

const CustomerEmojiContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CustomerEmoji = styled.span`
  font-size: 1.6rem;
  margin: 0rem;
  &.customer-emoji {
    position: relative;
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

const WaitingCustomers = styled.p`
  color: #cbd5e0;
  font-size: 1rem;
  text-align: right;
`;

interface CustomersBoardProps {
  customers: string[];
  transaction: Transaction | null;

  animatingEmojis: { emoji: string; id: number; offset: string }[];
}

export const getRandomEmoji = () => {
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export const HomeBoard: React.FC<CustomersBoardProps> = ({
  customers,
  transaction,

  animatingEmojis,
}) => {
  return (
    <CustomerBoardContainer className=" m-100px">
      <FlexBoxRow className="w-full justify-end">
        <FlexBoxColNoGap className="bg-zinc-800 ">
          <WaitingCustomers>Customers: {customers.length}</WaitingCustomers>

          <CustomerEmojiContainer>
            <CustomerListContainer>
              {customers.length > 0 ? (
                <CustomerEmoji className="customer-emoji">
                  {customers[0]}
                </CustomerEmoji>
              ) : (
                <CustomerEmoji>
                  it's night time no more customers... Please wait
                </CustomerEmoji>
              )}
            </CustomerListContainer>
            {animatingEmojis.map(({ emoji, id, offset }) => (
              <div
                key={`${id}${offset}`}
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-2xl text-white animate-move-up-random-x"
                style={{ "--random-offset": offset } as React.CSSProperties}
              >
                {emoji}
              </div>
            ))}
          </CustomerEmojiContainer>
          <LastTransaction transaction={transaction} />
        </FlexBoxColNoGap>
      </FlexBoxRow>
    </CustomerBoardContainer>
  );
};
