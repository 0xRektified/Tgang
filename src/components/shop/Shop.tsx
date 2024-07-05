import React, { useState } from "react";
import { upgrades } from "../../mocks/backend.mock";
import WebApp from "@twa-dev/sdk";
import { TouchPoints } from "../utils/touchPoints";
import { FlexBoxRow, Tab, Tabs, UpgradeContainer } from "../styled/shopStyled";
import { TouchPoint, Upgrades } from "./utils/types";
import { RenderUpgrades } from "./RenderUpgrades";

interface ShopProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const Shop: React.FC<ShopProps> = ({ cashAmount, setCashAmount }) => {
  const [activeTab, setActiveTab] = useState<keyof Upgrades>("dealer");
  const [upgradesData, setUpgradesData] = useState<Upgrades>(upgrades);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);

  const handleTabClick = (tab: keyof Upgrades) => {
    setActiveTab(tab);
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
        <UpgradeContainer>
          <RenderUpgrades
            tab={activeTab}
            upgradesData={upgradesData}
            cashAmount={cashAmount}
            setCashAmount={setCashAmount}
            setUpgradesData={setUpgradesData}
            setTouchPoints={setTouchPoints}
          />
        </UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
    </>
  );
};
