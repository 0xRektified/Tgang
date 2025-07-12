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
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import { ApiToast } from "../ApiToast";
import mixpanel from "mixpanel-browser";

interface UpgradeProps {
  userInfo: IUserInfo;
  activeTab: string;
  upgradesData: IUpgrade | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
}

export const Upgrade: React.FC<UpgradeProps> = ({
  userInfo,
  activeTab,
  upgradesData,
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

  const {
    buyUpgrade,
    loading: upgradeLoading,
    error: upgradeError,
    successMessage: upgradeSuccess,
  } = useBuyUpgrades();

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
        </TabContainer>
        <UpgradeContainer>
          {currentTab === "dealer" && renderUpgrades()}
        </UpgradeContainer>
        <TouchPoints touchPoints={touchPoints} />
        <ApiToast
          loading={upgradeLoading}
          error={upgradeError}
          successMessage={upgradeSuccess}
        />
      </ShopContainer>
    </>
  );
};

export default Upgrade;
