import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaQuestion } from "react-icons/fa";
// import { LastTransaction } from "./LastTransaction";
// import { Transaction } from "./utils/types";

/** HOLD GAUGE CODE IN CASE ITS NEEDED AGAIN */

// const HorizontalProgressBarContainer = styled.div`
//   width: 2em;
//   height: 10px;
//   background-color: rgba(0, 0, 0, 0.3);
//   border-radius: 5px;
//   overflow: hidden;
//   position: relative;
//   box-shadow: 0 0 5px rgba(30, 144, 255, 0.3);
// `;

// const glowAnimation = keyframes`
//   0% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
//   50% { box-shadow: 0 0 4px #1e90ff, 0 0 8px #1e90ff; }
//   100% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
// `;

// const ProgressFill = styled.div<{ width: number; isDecreasing: boolean }>`
//   height: 100%;
//   width: ${(props) => props.width}%;
//   background-color: #1e90ff;
//   position: absolute;
//   left: 0;
//   transition: width 0.3s ease-out;
//   animation: ${(props) => (props.isDecreasing ? decreaseAnimation : "none")}
//     0.5s ease-out;

//   &::after {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 2px;
//     background: linear-gradient(
//       to bottom,
//       rgba(255, 255, 255, 0.8),
//       rgba(255, 255, 255, 0)
//     );
//     animation: ${glowAnimation} 1.5s infinite;
//   }
// `;

// const electricEffect = keyframes`
//   0%, 100% {
//     opacity: 0;
//   }
//   50% {
//     opacity: 1;
//   }
// `;

// const decreaseAnimation = keyframes`
//   0% { background-color: #5c36fb; }
//   100% { background-color: #1e90ff; }
// `;

// const ElectricEffect = styled.div<{ height: number }>`
//   position: absolute;
//   bottom: ${(props) => props.height}%;
//   left: -5px;
//   right: -5px;
//   height: 4px;
//   background: linear-gradient(
//     to right,
//     transparent,
//     #00ffff,
//     #1e90ff,
//     #00ffff,
//     transparent
//   );
//   opacity: 0;
//   animation: ${electricEffect} 0.5s ease-out;
//   box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
//   z-index: 1;
// `;

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
  animation: ${props => props.shake ? shakeAnimation : 'none'} 0.3s ease-in-out;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #242627;
  margin-top: 10em;
  padding: 1em;
  border-radius: 0.5rem;
  max-width: 80%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const RedQuestionIcon = styled(FaQuestion)`
  color: red;
  font-size: 2rem;
  margin-bottom: 0.5em;
`;

interface HomeBoardProps {
  customer: string;
  customerAmount: number;
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
  animatingEmojis,
}) => {
  const maxCustomers = 500;
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 300);
    return () => clearTimeout(timer);
  }, [customerAmount]);

  return (
    <HomeBoardContainer shake={shake}>
      <CustomerInfo>
        <CustomerEmoji>{customerAmount > 0 ? customer : "💀"}</CustomerEmoji>
        {/* Commented out gauge
        <HorizontalProgressBarContainer>
          <ProgressFill width={fillPercentage} isDecreasing={isDecreasing} />
        </HorizontalProgressBarContainer>
        */}
        <QuestionMark onClick={() => setShowModal(true)}>?</QuestionMark>
      </CustomerInfo>
      <CustomerCount>
        {customerAmount} / {maxCustomers}
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

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <RedQuestionIcon />
            <p>
              You currently have {maxCustomers} new customers per hour who may
              buy your resources.
            </p>
          </ModalContent>
        </Modal>
      )}
    </HomeBoardContainer>
  );
};
