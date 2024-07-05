import React, { useState, useEffect } from "react";
import { TouchPoints } from "../utils/touchPoints";
import { FlexBoxRow, Tab, Tabs, UpgradeContainer } from "../styled/shopStyled";
import { TouchPoint, Upgrades } from "./utils/types";
import { RenderUpgrades } from "./RenderUpgrades";
import { Product } from "../home/utils/types";

interface ShopProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  activeTab: keyof Upgrades;
  upgradesData: Upgrades;
  setUpgradesData: React.Dispatch<React.SetStateAction<Upgrades>>;
}

export const Shop: React.FC<ShopProps> = ({
  cashAmount,
  setCashAmount,
  products,
  setProducts,
  activeTab,
  upgradesData,
  setUpgradesData,
}) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentTab, setCurrentTab] = useState<keyof Upgrades>(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab: keyof Upgrades) => {
    setCurrentTab(tab);
  };

  return (
    <>
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
            setUpgradesData={setUpgradesData}
            setTouchPoints={setTouchPoints}
            products={products}
            setProducts={setProducts}
          />
        </UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
    </>
  );
};

export default Shop;
