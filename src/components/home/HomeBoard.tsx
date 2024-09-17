import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaQuestion } from "react-icons/fa";
import { CloseButton } from "./styles/supplier.css";

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const HomeBoardContainer = styled.div<{ shake: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5em;
  border-radius: 0.5rem;
  z-index: 2;
  background-color: #242627;
  border: 2px solid white;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;
  animation: ${(props) => (props.shake ? shakeAnimation : "none")} 0.3s
    ease-in-out;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const CustomerEmoji = styled.div`
  font-size: 1rem;
  margin-right: 0.5em;
`;

const CustomerCount = styled.div`
  font-size: 0.8rem;
  color: white;
  text-align: center;
`;

const AnimatingEmojiContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const QuestionMark = styled.span`
  cursor: pointer;
  margin-left: 0.5em;
  font-size: 1rem;
  color: #1e90ff;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-top: 2em;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #242627;
  padding: 1em;
  border-radius: 0.5rem;
  max-width: 80%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  position: relative;
`;

const RedQuestionIcon = styled(FaQuestion)`
  color: red;
  font-size: 2rem;
  margin-bottom: 0.5em;
`;

interface HomeBoardProps {
  customer: string;
  customerAmount: number;
  customerAmountMax: number;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
}

export const getRandomEmoji = () => {
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
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export const HomeBoard: React.FC<HomeBoardProps> = ({
  customer,
  customerAmount,
  customerAmountMax,
  animatingEmojis,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (customerAmount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [customerAmount]);

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <>
      <HomeBoardContainer shake={shake}>
        <CustomerInfo>
          <CustomerEmoji>{customerAmount > 0 ? customer : "💀"}</CustomerEmoji>
          <QuestionMark onClick={() => setShowModal(true)}>?</QuestionMark>
        </CustomerInfo>
        <CustomerCount>
          {customerAmount} / {customerAmountMax}
        </CustomerCount>

        <AnimatingEmojiContainer>
          {animatingEmojis.map(({ emoji, id, offset }) => (
            <div
              key={`${id}${offset}`}
              className="absolute text-2xl text-white animate-move-up-random-x"
              style={
                {
                  "--random-offset": offset,
                  transform: `translateX(${offset})`,
                } as React.CSSProperties
              }
            >
              {emoji}
            </div>
          ))}
        </AnimatingEmojiContainer>
      </HomeBoardContainer>

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <RedQuestionIcon />
            <p>
              You currently have {customerAmountMax} new customers per hour who
              may buy your resources.
            </p>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
