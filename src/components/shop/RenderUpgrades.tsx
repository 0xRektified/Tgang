import React from "react";
import { Upgrade, Upgrades, TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import { Product } from "../interfaces/user.interface";

interface RenderUpgradesProps {
  tab: keyof Upgrades;
  upgradesData: Upgrades;
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setUpgradesData: React.Dispatch<React.SetStateAction<Upgrades>>;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  tab,
  upgradesData,
  cashAmount,
  setCashAmount,
  setUpgradesData,
  setTouchPoints,
  products,
  setProducts,
}) => {
  const handleBuyUpgrade = (
    upgrade: Upgrade,
    touch: React.Touch,
    position: { top: number; left: number }
  ) => {
    if (cashAmount >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
      setCashAmount(cashAmount - upgrade.cost);

      setUpgradesData((prevData) => {
        const updatedTab = prevData[tab].map((item) => {
          if (item.id === upgrade.id) {
            const newLevel = item.level + 1;
            return { ...item, level: newLevel };
          }
          return item;
        });

        const newTab = updatedTab.map((item) => {
          if (
            item.requirement &&
            item.requirement.title === upgrade.title &&
            upgrade.level + 1 >= item.requirement.level
          ) {
            return { ...item, locked: false };
          }
          return item;
        });

        return { ...prevData, [tab]: newTab };
      });

      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.name === upgrade.title) {
            return {
              ...product,
              unlocked: true,
              maxCarry: product.maxCarry + 50,
            };
          }
          return product;
        });
      });

      const newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: -upgrade.cost,
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
    upgrade: Upgrade,
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = { top: rect.top, left: rect.left };

    handleBuyUpgrade(upgrade, touch, position);
  };

  const groupedUpgrades = upgradesData[tab].reduce((acc, upgrade) => {
    if (!acc[upgrade.group]) {
      acc[upgrade.group] = [];
    }
    acc[upgrade.group].push(upgrade);
    return acc;
  }, {} as Record<string, Upgrade[]>);

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
                onTouchStart={(e) => handleCardClick(upgrade, e)}
              >
                <div className="flex justify-between items-center">
                  <img
                    src={upgrade.image}
                    alt={upgrade.title}
                    className="w-16 h-16"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">{upgrade.title}</h4>
                    {upgrade.locked ? (
                      <p className="text-red-500">Locked</p>
                    ) : (
                      <>
                        <p>Cost: ${upgrade.cost}</p>
                        <p>
                          Level: {upgrade.level}/{upgrade.maxLevel}
                        </p>
                      </>
                    )}
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
};
