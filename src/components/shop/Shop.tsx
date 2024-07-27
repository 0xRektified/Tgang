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
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { RenderShipping } from "./RenderShipping";

interface ShopProps {
  userInfo: IUserInfo;
  activeTab: string;
  upgradesData: IUpgrade | undefined;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
}

export const Shop: React.FC<ShopProps> = ({
  userInfo,
  activeTab,
  upgradesData,
  shippingMethods,
  setUserInfo,
  setUpgrades,
}) => {
  const [showBalanceErrorToast, setShowBalanceErrorToast] =
    useState<boolean>(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (showBalanceErrorToast) {
      const timeout = setTimeout(() => {
        setShowBalanceErrorToast(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showBalanceErrorToast]);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const renderUpgrades = () => {
    console.log("upgradesData", currentTab, currentTab === "dealer");
    console.log("upgradesData", currentTab, currentTab === "dealer");
    return (
      <RenderUpgrades
        userInfo={userInfo}
        tab={currentTab}
        upgradesData={upgradesData}
        setTouchPoints={setTouchPoints}
        setUserInfo={setUserInfo}
        setUpgrades={setUpgrades}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
      />
    );
  };

  const renderShipping = () => {
    console.log("shippingMethods", currentTab);
    return (
      <RenderShipping
        userInfo={userInfo}
        tab={currentTab}
        shippingMethods={shippingMethods}
        setTouchPoints={setTouchPoints}
        setUserInfo={setUserInfo}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
      />
    );
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
            active={currentTab === "shipping"}
            onClick={() => handleTabClick("shipping")}
          >
            Shipping
          </Tab>
        </Tabs>
      </FlexBoxRow>
      <FlexBoxRow>
        <UpgradeContainer>
          {currentTab === "dealer" && renderUpgrades()}
          {currentTab === "shipping" && renderShipping()}
        </UpgradeContainer>
      </FlexBoxRow>
      <TouchPoints touchPoints={touchPoints} />
      {showBalanceErrorToast && (
        <div className="fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right">
          <div className="toast toast-top toast-end">
            <div className="alert alert-error p-4 rounded shadow-lg text-white bg-red-600 font-bold">
              <span> `Not enough cash.</span>
            </div>
          </div>
        </div>
      )}
    </ShopContainer>
  );
};

export default Shop;
