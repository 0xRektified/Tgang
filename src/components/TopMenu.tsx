import React from "react";
import { IUserInfo } from "./interfaces/user.interface";
import rank from "/assets/rank.png";

interface TopMenuProps {
  userInfo: IUserInfo | undefined;
  cashAmount: number;
}

export const TopMenu: React.FC<TopMenuProps> = ({ userInfo, cashAmount }) => {
  return (
    <div
      id="mainView"
      className="bg-zinc-800 text-white px-4 shadow-lg p-4 w-full"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={rank} alt="Rank" className="w-6 h-6" />
          <span className="text-sm md:text-base lg:text-lg font-semibold">
            {userInfo ? userInfo.username : `Welcome`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs md:text-sm lg:text-base">
            Current balance
          </span>
          <span className="text-lg md:text-xl lg:text-2xl font-bold text-green-500 animate-pulse">
            ${cashAmount}
          </span>
        </div>
      </div>
    </div>
  );
};
