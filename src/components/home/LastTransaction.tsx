import React from "react";
import styled from "styled-components";
import { EProductIcon } from "../interfaces/product.interface";
import { Transaction } from "./utils/types";

const TransactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
`;

const TransactionStatus = styled.p`
  flex: 1;
  color: #cbd5e0;
  font-size: 0.8rem;
`;

interface LastTransactionProps {
  transaction: Transaction | null;
}

export const LastTransaction: React.FC<LastTransactionProps> = ({
  transaction,
}) => {
  return (
    <TransactionContainer className="rounded shadow-lg w-full ">
      {transaction &&
        (transaction.type === "success" ? (
          <TransactionStatus>
            Sold {transaction.quantity}{" "}
            {EProductIcon[transaction.product as keyof typeof EProductIcon]} $
            {transaction.amountEarned?.toFixed(0)}
          </TransactionStatus>
        ) : (
          <></>
        ))}
    </TransactionContainer>
  );
};
