import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import { EDealerUpgrade, EUpgradeCategory, IUpgrade } from "../interfaces/upgrade.interface";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import styled from "styled-components";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";

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
  userInfo: IUserInfo;
  tab: string;
  upgradesData: IUpgrade | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<
    React.SetStateAction<IUpgrade | undefined>
  >;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  userInfo,
  tab,
  upgradesData,
  setTouchPoints,
  setUserInfo,
}) => {
  const { buyUpgrade } = useBuyUpgrades();

  const handleBuyUpgrade = async (params: {
    category: EUpgradeCategory;
    upgrade: EProduct | EDealerUpgrade;
    upgradePrice: number;
  }, touch: React.Touch) => {
    const cost = params.upgradePrice;
    if (userInfo.cashAmount >= cost) {
      await buyUpgrade(params, setUserInfo);

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
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
      upgradePrice: number;
    },
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    const touch = e.touches[0];

    handleBuyUpgrade(params, touch);
  };

  if (upgradesData) {
    switch (tab) {
      case "dealer":
        return <div className="space-y-4">
          <div key="Customers">
            <h3 className="text-lg font-semibold capitalize">Customers</h3>
            <div className="space-y-2">
              {Object.entries(upgradesData.dealer).map(([key, upgrade]) => {
                const userUpgrade = userInfo.dealerUpgrades.find((u) => u.product === key);

                return (<div
                  key={upgrade.title}
                >
                  <div className="flex justify-between items-center">
                    <img
                      src={upgrade.image}
                      alt={upgrade.title}
                      className="w-16 h-16"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold">{upgrade.title}</h4>
                      <p>Cost: ${userUpgrade?.upgradePrice}</p>
                      <p>
                        Level: {userUpgrade?.level}
                      </p>
                    </div>
                    <div className="ml-4 flex-end">
                      <NeonButton
                        onTouchStart={(e) => handleCardClick({
                          category: EUpgradeCategory.DEALER,
                          upgrade: key as EDealerUpgrade,
                          upgradePrice: userUpgrade?.upgradePrice || 0
                        }, e)}
                      >
                        Buy
                      </NeonButton>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
          <div key="Products">
            <h3 className="text-lg font-semibold capitalize">Products</h3>
            <div className="space-y-2">
              {Object.entries(upgradesData.product).map(([key, upgrade]) => {
                const userUpgrade = userInfo.products.find((u) => u.name === key);
                const price = userUpgrade?.upgradePrice || upgrade.basePrice;
                const level = userUpgrade?.level || 0;
                const upgradeRequirements = upgrade.requirement;
                let locked = false;
                if (upgradeRequirements) {
                  const requiredProduct = userInfo.products.find((u) => u.name === upgradeRequirements.product);
                  if (!requiredProduct) {
                    locked = true;
                  } else {
                    locked = requiredProduct.level < upgradeRequirements.level;
                  }
                }

                return (<div
                  key={upgrade.title}
                >
                  <div className="flex justify-between items-center">
                    <img
                      src={upgrade.image}
                      alt={upgrade.title}
                      className="w-16 h-16"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold">{upgrade.title}</h4>
                        {locked ? (
                          <p className="text-red-500">Locked</p>
                        ) : (
                          <>
                            <p>Cost: ${price}</p>
                            <p>
                              Level: {level}
                            </p>
                          </>
                        )}
                    </div>
                    <div className="ml-4 flex-end">
                        {locked ? (
                        <Button>Locked</Button>
                      ) : (
                        <NeonButton
                          onTouchStart={(e) => handleCardClick({
                            category: EUpgradeCategory.PRODUCT,
                            upgrade: key as EDealerUpgrade,
                            upgradePrice: price
                          }, e)}
                        >
                          Buy
                        </NeonButton>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      case "gangster":
        return <></>;
      default:
        return <></>;
    }
  }
  return <></>;
};
