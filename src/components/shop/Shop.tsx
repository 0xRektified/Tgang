import React, { Touch, useState } from "react";
import { upgrades } from "../../mocks/backend.mock";
import styled from "styled-components";
import WebApp from "@twa-dev/sdk";
import { TouchPoints } from "../utils/touchPoints";

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

// Styled components
const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #1f2937;
  border-radius: 0.375rem;
`;

const Tab = styled.a<{ active: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#9ca3af")};
  border-radius: 0.375rem;
  &:hover {
    background-color: #3b82f6;
    color: #fff;
  }
`;

const UpgradeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  height: 40rem;
  gap: 1rem;
  justify-content: center;
`;

const UpgradeCard = styled.div<{ locked: boolean }>`
  background-color: #f3f4f6;
  width: 10rem;
  height: 12rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(0.95);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

const CardImage = styled.figure`
  margin: 0;
  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.375rem;
  }
`;

const CardDetails = styled.div`
  text-align: right;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardBody = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
`;

const CardDescription = styled.p``;

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
