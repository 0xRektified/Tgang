import React from "react";
import {
  CardBody,
  CardDescription,
  CardDetails,
  CardHeader,
  CardImage,
  CardTitle,
  UpgradeCard,
} from "../styled/shopStyled";
import { Upgrade, Upgrades, TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import { Product } from "../home/utils/types";

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

      // @note IF API Call succeed update the state
      setUpgradesData((prevData) => {
        const updatedTab = prevData[tab].map((item) =>
          item.id === upgrade.id ? { ...item, level: item.level + 1 } : item
        );
        return { ...prevData, [tab]: updatedTab };
      });

      // Update products based on the upgrade
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.name === upgrade.title) {
            return {
              ...product,
              unlocked: true,
              maxCarry: product.maxCarry + 50,
            }; // Example logic to increase maxCarry
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

  return (
    <>
      {upgradesData[tab].map((upgrade) => (
        <UpgradeCard
          key={upgrade.id}
          locked={upgrade.locked}
          onTouchStart={(e) => handleCardClick(upgrade, e)}
        >
          <CardHeader>
            <CardImage>
              <img src={upgrade.image} alt={upgrade.title} />
            </CardImage>
            <CardDetails>
              {upgrade.locked ? (
                <>
                  <CardDescription>Locked</CardDescription>
                </>
              ) : (
                <>
                  <CardDescription>Cost: ${upgrade.cost}</CardDescription>
                  <CardDescription>
                    Level: {upgrade.level}/{upgrade.maxLevel}
                  </CardDescription>
                </>
              )}
            </CardDetails>
          </CardHeader>
          <CardBody>
            <CardTitle>{upgrade.title}</CardTitle>
            <CardDescription>{upgrade.description}</CardDescription>
          </CardBody>
        </UpgradeCard>
      ))}
    </>
  );
};
