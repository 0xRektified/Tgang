import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import { Product } from "../interfaces/user.interface";
import { IUpgrade, IUpgradesCategory } from "../interfaces/upgrade.interface";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";

interface RenderUpgradesProps {
  tab: string;
  upgradesData: IUpgradesCategory[] | undefined;
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setUpgrades: React.Dispatch<
    React.SetStateAction<IUpgradesCategory[] | undefined>
  >;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  tab,
  upgradesData,
  cashAmount,
  setCashAmount,
  setTouchPoints,
  setUpgrades,
}) => {
  const { buyUpgrade } = useBuyUpgrades();

  const handleBuyUpgrade = async (upgrade: IUpgrade, touch: React.Touch) => {
    const cost = upgrade.levelPrices[upgrade.level];
    if (cashAmount >= cost && upgrade.level < upgrade.maxLevel) {
      await buyUpgrade(upgrade.id, setCashAmount, setUpgrades);

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
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

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
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                          onTouchStart={(e) => handleCardClick(upgrade, e)}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                    <p className="mt-2">
                      {upgrade.locked
                        ? `Unlock ${upgrade.requirement?.title} first`
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
