import React, { useState, useEffect } from "react";
import { TouchPoints } from "../utils/touchPoints";
import {
  FlexBoxRow,
  Tab,
  Tabs,
  UpgradeContainer,
  ShopContainer,
} from "../styled/shopStyled";
import { TouchPoint } from "./utils/types";
import { RenderUpgrades } from "./RenderUpgrades";
import { IUserInfo } from "../interfaces/user.interface";
import { IUpgradesCategory } from "../interfaces/upgrade.interface";

interface ShopProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  activeTab: string;
  upgradesData: IUpgradesCategory[] | undefined;
  setUpgrades: React.Dispatch<
    React.SetStateAction<IUpgradesCategory[] | undefined>
  >;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
}

export const Shop: React.FC<ShopProps> = ({
  cashAmount,
  setCashAmount,
  activeTab,
  upgradesData,
  setUpgrades,
  setUserInfo,
}) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <ShopContainer>
      <FlexBoxRow>
        <Tabs role="tablist">
          <Tab
            role="tab"
            active={currentTab === "dealer"}
            onClick={() => handleTabClick("dealer")}
          >
            Dealer
          </Tab>
          <Tab
            role="tab"
            active={currentTab === "farmer"}
            onClick={() => handleTabClick("farmer")}
          >
            Farmer
          </Tab>
          <Tab
            role="tab"
            active={currentTab === "gangster"}
            onClick={() => handleTabClick("gangster")}
          >
            Gangster
          </Tab>
        </Tabs>
      </FlexBoxRow>
      <FlexBoxRow>
        <UpgradeContainer>
          <RenderUpgrades
            tab={currentTab}
            upgradesData={upgradesData}
            cashAmount={cashAmount}
            setCashAmount={setCashAmount}
            setTouchPoints={setTouchPoints}
            setUpgrades={setUpgrades}
            setUserInfo={setUserInfo}
          />
        </UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
    </ShopContainer>
  );
};

export default Shop;
