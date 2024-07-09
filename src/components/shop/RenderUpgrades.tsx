import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import { IUpgrade, IUpgradesCategory } from "../interfaces/upgrade.interface";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import styled from "styled-components";
import { IUserInfo, Product } from "../interfaces/user.interface";

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 1px #eab308, 0 0 5px #eab308, 0 0 8px #eab308,
    0 0 10px #eab308;
  border: 2px solid #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, transform 0.1s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Button = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 2px solid;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface RenderUpgradesProps {
  tab: string;
  upgradesData: IUpgradesCategory[] | undefined;
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUpgrades: React.Dispatch<
    React.SetStateAction<IUpgradesCategory[] | undefined>
  >;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  tab,
  upgradesData,
  cashAmount,
  setCashAmount,
  setTouchPoints,
  setUpgrades,
  setUserInfo,
}) => {
  const { buyUpgrade } = useBuyUpgrades();

  const handleBuyUpgrade = async (upgrade: IUpgrade, touch: React.Touch) => {
    const cost = upgrade.levelPrices[upgrade.level];
    if (cashAmount >= cost && upgrade.level < upgrade.maxLevel) {
      await buyUpgrade(upgrade, setCashAmount, setUpgrades, setUserInfo);

      const newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: -cost,
      };

      setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
      setTimeout(() => {
        setTouchPoints((prevTouchPoints) =>
          prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
        );
      }, 3000);
      WebApp.HapticFeedback.impactOccurred("heavy");
    }
  };

  const handleCardClick = (
    upgrade: IUpgrade,
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    const touch = e.touches[0];

    handleBuyUpgrade(upgrade, touch);
  };

  if (upgradesData) {
    const tabPage = upgradesData.find((e) => e.category === tab);
    const groupedUpgrades = tabPage?.upgrades.reduce((acc, upgrade) => {
      if (!acc[upgrade.group]) {
        acc[upgrade.group] = [];
      }
      acc[upgrade.group].push(upgrade);
      return acc;
    }, {} as Record<string, IUpgrade[]>);

    if (groupedUpgrades) {
      return (
        <div className="space-y-4">
          {Object.keys(groupedUpgrades).map((group) => (
            <div key={group}>
              <h3 className="text-lg font-semibold capitalize">{group}</h3>
              <div className="space-y-2">
                {groupedUpgrades[group].map((upgrade) => (
                  <div
                    key={upgrade.id}
                    className={`p-4 border rounded-lg ${
                      upgrade.locked ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <img
                        src={upgrade.image}
                        alt={upgrade.title}
                        className="w-16 h-16"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold">{upgrade.title}</h4>
                        {upgrade.locked ? (
                          <p className="text-red-500">Locked</p>
                        ) : (
                          <>
                            <p>Cost: ${upgrade.levelPrices[upgrade.level]}</p>
                            <p>
                              Level: {upgrade.level}/{upgrade.maxLevel}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="ml-4 flex-end">
                        {upgrade.locked ? (
                          <Button>Locked</Button>
                        ) : (
                          <NeonButton
                            onTouchStart={(e) => handleCardClick(upgrade, e)}
                          >
                            Buy
                          </NeonButton>
                        )}
                      </div>
                    </div>
                    <p className="mt-2">
                      {upgrade.locked
                        ? `Unlock ${upgrade.requirement?.title} level ${upgrade.requirement?.level} first`
                        : upgrade.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  return <></>;
};
