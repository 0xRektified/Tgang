import React from "react";
import styled from "styled-components";
import { Transaction } from "./utils/types";

const TransactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
`;

const TransactionStatus = styled.p`
  flex: 1;
  color: #cbd5e0;
  font-size: 1rem;
`;

const WaitingCustomers = styled.p`
  color: #cbd5e0;
  font-size: 1rem;
  text-align: right;
`;

interface LastTransactionProps {
  transaction: Transaction | null;
  waitingCustomersCount: number;
}

export const LastTransaction: React.FC<LastTransactionProps> = ({
  transaction,
  waitingCustomersCount,
}) => {
  return (
    <TransactionContainer className="rounded shadow-lg w-full ">
      {transaction ? (
        transaction.type === "success" ? (
          <TransactionStatus>
            🤑 Sold {transaction.quantity} {transaction.product} $
            {transaction.amountEarned}
          </TransactionStatus>
        ) : (
          <TransactionStatus>
            🤬 No more {transaction.product}
          </TransactionStatus>
        )
      ) : (
        <TransactionStatus>No transactions yet.</TransactionStatus>
      )}
      <WaitingCustomers>Customers: {waitingCustomersCount}</WaitingCustomers>
    </TransactionContainer>
  );
};
