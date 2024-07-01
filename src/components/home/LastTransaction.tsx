import React from "react";
import { Transaction } from "./utils/types";

interface LastTransactionProps {
  transaction: Transaction | null;
  customerNbr: number;
}

export const LastTransaction: React.FC<LastTransactionProps> = ({
  transaction,
  customerNbr,
}) => {
  return (
    <div className="rounded shadow-lg w-full">
      <span className="font-bold">Customer waiting: {customerNbr}</span>

      {transaction ? (
        transaction.type === "success" ? (
          <p>
            🤑 Successful deal: Sold {transaction.quantity}{" "}
            {transaction.product} for ${transaction.amountEarned}
          </p>
        ) : (
          <p>
            🤬 Missed deal: {transaction.quantity} {transaction.product}
          </p>
        )
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
};
