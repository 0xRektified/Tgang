import React from "react";
import { TouchPoint } from "../home/utils/types";

interface TouchPointsProps {
  touchPoints: TouchPoint[];
}

export const TouchPoints: React.FC<TouchPointsProps> = ({ touchPoints }) => {
  return (
    <>
      {touchPoints.map((point) => (
        <div
          key={point.id}
          className={`absolute font-bold animate-fade-out text-3xl pointer-events-none ${
            point.amountEarned > 0 ? "text-green-500" : "text-red-500"
          }`}
          style={{ top: point.y - 50, left: point.x }}
        >
          {point.amountEarned > 0
            ? `+${point.amountEarned}$`
            : `${point.amountEarned}$`}
        </div>
      ))}
    </>
  );
};
