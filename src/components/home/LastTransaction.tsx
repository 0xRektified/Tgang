import React, { useEffect, useRef, useState } from "react";
import { Transaction } from "./utils/types";

interface LastTransactionProps {
  transaction: Transaction | null;
}

export const LastTransaction: React.FC<LastTransactionProps> = ({
  transaction,
}) => {
  // const [key, setKey] = useState(0);

  // useEffect(() => {
  //   if (transaction) {
  //     setKey((prevKey) => prevKey + 1);
  //   }
  // }, [transaction]);

  return (
    <div
      // key={key}
      className="rounded shadow-lg w-full animate-slide-in-from-right-bounce"
    >
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
