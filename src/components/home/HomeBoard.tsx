import React from "react";
import styled from "styled-components";
import { FlexBoxRow } from "../styled/globalStyled";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";
import { RiShipLine } from "react-icons/ri";

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

const HeaderRow = styled(FlexBoxRow)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 6px;
  box-shadow: 0 0 1px #eab308, 0 0 5px #eab308, 0 0 8px #eab308,
    0 0 10px #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  margin: 1em;
  padding: 1em;
  flex: 1;
`;

const ShipButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 6px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const FlexBoxRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 75%;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
`;

const CustomerEmojiContainer = styled.div`
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CustomerEmoji = styled.span`
  font-size: 1.4rem;
  margin: 0.2rem;
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

interface CustomersBoardProps {
  customers: string[];
  transaction: Transaction | null;
  handleOpenSupplierModal: () => void;
  handleOpenShippingModal: () => void;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
}

export const getRandomEmoji = () => {
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export const HomeBoard: React.FC<CustomersBoardProps> = ({
  customers,
  transaction,
  handleOpenSupplierModal,
  handleOpenShippingModal,
  animatingEmojis,
}) => {
  return (
    <CustomerBoardContainer className="bg-zinc-800 m-100px">
      <HeaderRow>
        <LastTransaction
          transaction={transaction}
          waitingCustomersCount={customers.length}
        />
      </HeaderRow>
      <FlexBoxRow className="w-full">
        <FlexBoxRowContainer>
          <NeonButton onClick={handleOpenSupplierModal} className="skeleton">
            Market
          </NeonButton>
          <ShipButton onClick={handleOpenShippingModal}>
            <RiShipLine />
          </ShipButton>
        </FlexBoxRowContainer>
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
      </FlexBoxRow>
    </CustomerBoardContainer>
  );
};
