import React from "react";
import styled from "styled-components";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";
import { FlexBoxRow } from "../styled/globalStyled";

const CustomerEmojiContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FlexBoxColNoGap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
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
  font-size: 0.8rem;
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
    <FlexBoxRow className="w-full justify-center">
      <FlexBoxColNoGap className="bg-zinc-800 ">
        <WaitingCustomers>Customers</WaitingCustomers>
        <WaitingCustomers>{customers.length}</WaitingCustomers>

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
        </CustomerEmojiContainer>
        {animatingEmojis.map(({ emoji, id, offset }) => (
          <div
            key={`${id}${offset}`}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-2xl text-white animate-move-up-random-x "
            style={{ "--random-offset": offset } as React.CSSProperties}
          >
            {emoji}
          </div>
        ))}
        {/* <LastTransaction transaction={transaction} /> */}
      </FlexBoxColNoGap>
    </FlexBoxRow>
  );
};
