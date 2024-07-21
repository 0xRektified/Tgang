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
import { IUpgrade } from "../interfaces/upgrade.interface";

interface ShopProps {
  userInfo: IUserInfo;
  activeTab: string;
  upgradesData: IUpgrade | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
}

export const Shop: React.FC<ShopProps> = ({
  userInfo,
  activeTab,
  upgradesData,
  setUserInfo,
  setUpgrades,
}) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // const handleTabClick = (tab: string) => {
  //   setCurrentTab(tab);
  // };

  return (
    <ShopContainer>
      <FlexBoxRow>
        {/* @note temporary disable the tab
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
            active={currentTab === "gangster"}
            onClick={() => handleTabClick("gangster")}
          >
            Gangster
          </Tab>
        </Tabs> 
        */}
      </FlexBoxRow>
      <FlexBoxRow>
        <UpgradeContainer>
          <RenderUpgrades
            userInfo={userInfo}
            tab={currentTab}
            upgradesData={upgradesData}
            setTouchPoints={setTouchPoints}
            setUserInfo={setUserInfo}
            setUpgrades={setUpgrades}
          />
        </UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
    </ShopContainer>
  );
};

export default Shop;
