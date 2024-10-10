import WebApp from "@twa-dev/sdk";
import React, { useState, useEffect } from "react";
import { TouchPoints } from "../utils/touchPoints";
import {
  FlexBoxRow,
  TabButton,
  TabContainer,
  UpgradeContainer,
  ShopContainer,
} from "../styled/shopStyled";
import { TouchPoint } from "../utils/types";
import { RenderUpgrades } from "./RenderUpgrades";
import { IUserInfo } from "../interfaces/user.interface";
import { IUpgrade } from "../interfaces/upgrade.interface";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import { RenderShipping } from "./RenderShipping";
import { useBuyShippingMethod } from "../../hooks/useBuyShippingMethod";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import { ApiToast } from "../ApiToast";
import { useUpgradeShippingCapacity } from "../../hooks/useUpgradeShippingCapacity";
import { useUpgradeShippingShippingTime } from "../../hooks/useUpgradeShippingTime";
import { IMarketInfo } from "../interfaces/market.interface";
import mixpanel from "mixpanel-browser";

interface UpgradeProps {
  userInfo: IUserInfo;
  activeTab: string;
  upgradesData: IUpgrade | undefined;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
  setMarketInfo: React.Dispatch<React.SetStateAction<IMarketInfo | undefined>>;
}

export const Upgrade: React.FC<UpgradeProps> = ({
  userInfo,
  activeTab,
  upgradesData,
  shippingMethods,
  setUserInfo,
  setUpgrades,
  setMarketInfo,
}) => {
  const [showBalanceErrorToast, setShowBalanceErrorToast] =
    useState<boolean>(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const {
    buyShippingMethod,
    loading: shippingLoading,
    error: shippingError,
    successMessage: shippingSuccess,
  } = useBuyShippingMethod();
  const {
    buyUpgrade,
    loading: upgradeLoading,
    error: upgradeError,
    successMessage: upgradeSuccess,
  } = useBuyUpgrades();

  const {
    upgradeShippingCapacity,
    loading: capacityLoading,
    error: capacityError,
    successMessage: capacitySuccess,
  } = useUpgradeShippingCapacity();

  const {
    upgradeShippingShippingTime,
    loading: shippingTimeLoading,
    error: shippingTimeError,
    successMessage: shippingTimeSuccess,
  } = useUpgradeShippingShippingTime();

  useEffect(() => {
    if (showBalanceErrorToast) {
      const timeout = setTimeout(() => {
        setShowBalanceErrorToast(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showBalanceErrorToast]);

  const handleTabClick = (tab: string) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setCurrentTab(tab);
    mixpanel.track("Shop Tab Changed", { tab });
  };

  const renderUpgrades = () => {
    return (
      <RenderUpgrades
        userInfo={userInfo}
        tab={currentTab}
        upgradesData={upgradesData}
        setTouchPoints={setTouchPoints}
        setUserInfo={setUserInfo}
        setUpgrades={setUpgrades}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
        buyUpgrade={buyUpgrade}
        setMarketInfo={setMarketInfo}
      />
    );
  };

  const renderShipping = () => {
    return (
      <RenderShipping
        userInfo={userInfo}
        tab={currentTab}
        shippingMethods={shippingMethods}
        setTouchPoints={setTouchPoints}
        setUserInfo={setUserInfo}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
        buyShippingMethod={buyShippingMethod}
        upgradeShippingCapacity={upgradeShippingCapacity}
        upgradeShippingShippingTime={upgradeShippingShippingTime}
      />
    );
  };

  return (
    <>
      <ShopContainer>
        <TabContainer>
          <TabButton
            role="tab"
            active={currentTab === "dealer"}
            onClick={() => handleTabClick("dealer")}
          >
            Production
          </TabButton>
          <TabButton
            role="tab"
            active={currentTab === "shipping"}
            onClick={() => handleTabClick("shipping")}
          >
            Shipping
          </TabButton>
        </TabContainer>
        <UpgradeContainer>
          {currentTab === "dealer" && renderUpgrades()}
          {currentTab === "shipping" && renderShipping()}
        </UpgradeContainer>
        <TouchPoints touchPoints={touchPoints} />
        <ApiToast
          loading={
            shippingLoading ||
            upgradeLoading ||
            capacityLoading ||
            shippingTimeLoading
          }
          error={
            shippingError || upgradeError || capacityError || shippingTimeError
          }
          successMessage={
            shippingSuccess ||
            upgradeSuccess ||
            capacitySuccess ||
            shippingTimeSuccess
          }
        />
      </ShopContainer>
    </>
  );
};

export default Upgrade;
