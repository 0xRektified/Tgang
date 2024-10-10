import React from "react";
import styled from "styled-components";
import { TouchPoint, Transaction } from "../home/utils/types";
import { EProductIcon } from "../interfaces/product.interface";

interface TouchPointsProps {
  touchPoints: TouchPoint[];
  lastTransaction?: Transaction | null;
}

const TouchPointContainer = styled.div`
  position: absolute;
  font-bold: true;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AmountText = styled.div<{ positive: boolean }>`
  font-size: 1.5rem;
  color: ${(props) => (props.positive ? "#4CAF50" : "#F44336")};
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
`;

const TransactionText = styled.div`
  font-size: 0.8rem;
  color: #ffffff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
`;

export const TouchPoints: React.FC<TouchPointsProps> = ({
  touchPoints,
  lastTransaction,
}) => {
  return (
    <>
      {touchPoints.map((point) => (
        <TouchPointContainer
          key={point.id}
          style={{ top: point.y - 50, left: point.x }}
          className="animate-fade-out"
        >
          <AmountText positive={point.amountEarned > 0}>
            {point.amountEarned > 0
              ? `+$${point.amountEarned}`
              : `-$${Math.abs(point.amountEarned)}`}
          </AmountText>
          {lastTransaction && (
            <TransactionText>
              {lastTransaction.type === "success"
                ? `Sold ${lastTransaction.quantity} ${
                    EProductIcon[
                      lastTransaction.product as keyof typeof EProductIcon
                    ]
                  }`
                : `Missed sale: ${lastTransaction.quantity} ${
                    EProductIcon[
                      lastTransaction.product as keyof typeof EProductIcon
                    ]
                  }`}
            </TransactionText>
          )}
        </TouchPointContainer>
      ))}
    </>
  );
};
