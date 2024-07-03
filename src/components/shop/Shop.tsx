import React, { Touch, useState } from "react";
import { upgrades } from "../../mocks/backend.mock";
import WebApp from "@twa-dev/sdk";
import { TouchPoints } from "../utils/touchPoints";
import {
  CardBody,
  CardDescription,
  CardDetails,
  CardHeader,
  CardImage,
  CardTitle,
  FlexBoxRow,
  Tab,
  Tabs,
  UpgradeCard,
  UpgradeContainer,
} from "../styled/shopStyled";

// Updated types.ts
export interface Upgrade {
  id: number;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  image: string;
  locked: boolean;
  requirement: { title: string; level: number } | null;
}

export interface Upgrades {
  dealer: Upgrade[];
  farmer: Upgrade[];
  gangster: Upgrade[];
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  amountEarned: number;
}

interface ShopProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const Shop: React.FC<ShopProps> = ({ cashAmount, setCashAmount }) => {
  const [activeTab, setActiveTab] = useState<keyof Upgrades>("dealer");
  const [upgradesData, setUpgradesData] = useState(upgrades);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);

  const handleTabClick = (tab: keyof Upgrades) => {
    setActiveTab(tab);
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

  const handleBuyUpgrade = (
    upgrade: Upgrade,
    touch: React.Touch,
    position: { top: number; left: number }
  ) => {
    if (cashAmount >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
      setCashAmount(cashAmount - upgrade.cost);
      setUpgradesData((prevData) => {
        const updatedTab = prevData[activeTab].map((item) =>
          item.id === upgrade.id ? { ...item, level: item.level + 1 } : item
        );
        return { ...prevData, [activeTab]: updatedTab };
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

  const renderUpgrades = (tab: keyof Upgrades) => {
    return upgradesData[tab].map((upgrade) => (
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
    ));
  };

  return (
    <>
      <FlexBoxRow>
        <Tabs role="tablist">
          <Tab
            role="tab"
            active={activeTab === "dealer"}
            onClick={() => handleTabClick("dealer")}
          >
            Dealer
          </Tab>
          <Tab
            role="tab"
            active={activeTab === "farmer"}
            onClick={() => handleTabClick("farmer")}
          >
            Farmer
          </Tab>
          <Tab
            role="tab"
            active={activeTab === "gangster"}
            onClick={() => handleTabClick("gangster")}
          >
            Gangster
          </Tab>
        </Tabs>
      </FlexBoxRow>
      <FlexBoxRow>
        <UpgradeContainer>{renderUpgrades(activeTab)}</UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
    </>
  );
};
