import "./App.css";
import styled from "styled-components";
import { FlexBoxColNoGap } from "./components/styled/globalStyled";
import "@twa-dev/sdk";
import { useEffect, useState, useCallback } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Shop } from "./components/shop/Shop";
import { TopMenu } from "./components/TopMenu";
import Loading from "./components/Loading";
import { useInitializeGame } from "./hooks/useInitializeGame";
import Lab from "./components/labs/Lab";
import Pvp from "./components/pvp/Pvp";
import Airdrop from "./components/airdrop/Airdrop";
import WebApp from "@twa-dev/sdk";
import MobileOnly from "./components/MobileOnly";
import { initializeApp, cleanupApp } from "./appScreenHelper";

const StyledApp = styled.div`
  background-image: url("/assets/home/street.webp");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

const AppContainer = styled.div`
  max-width: 750px;
  margin: 0 auto;
  padding-bottom: 60px; /* Add padding to account for the footer */
`;

function App() {
  const {
    userInfo,
    upgrades,
    marketInfo,
    labs,
    shippingMethods,
    setUserInfo,
    setUpgrades,
    setMarketInfo,
    loading,
    error,
  } = useInitializeGame();

  const [currentView, setCurrentView] = useState("Base");
  const [activeTab, setActiveTab] = useState<string>("dealer");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    initializeApp();
    return () => {
      cleanupApp();
    };
  }, []);

  useEffect(() => {
    const test = document.getElementById("mainView");
    if (test) {
      test.scrollIntoView();
    }

    const timeout = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleUnlockClick = useCallback((tab?: string) => {
    if (tab) {
      setActiveTab(tab);
    }
    setCurrentView("Shop");
  }, []);

  const renderCurrentView = useCallback(() => {
    switch (currentView) {
      case "Base":
        return (
          <Home
            userInfo={userInfo}
            marketInfo={marketInfo}
            setUserInfo={setUserInfo}
            onUnlockClick={handleUnlockClick}
            shippingMethods={shippingMethods}
          />
        );
      case "Lab":
        return (
          <Lab userInfo={userInfo} labs={labs!} setUserInfo={setUserInfo} />
        );
      case "Shop":
        return (
          <Shop
            userInfo={userInfo}
            activeTab={activeTab}
            upgradesData={upgrades}
            shippingMethods={shippingMethods}
            setUserInfo={setUserInfo}
            setUpgrades={setUpgrades}
            setMarketInfo={setMarketInfo}
          />
        );
      case "Airdrop":
        return (
          <Airdrop
            referralToken={userInfo!.referralToken}
            referredUsers={userInfo!.referredUsers}
            activeTab={activeTab}
            userInfo={userInfo!}
            setUserInfo={setUserInfo}
          />
        );
      case "Pvp":
        return <Pvp userInfo={userInfo} />;
      default:
        return (
          <Home
            userInfo={userInfo}
            marketInfo={marketInfo}
            setUserInfo={setUserInfo}
            onUnlockClick={handleUnlockClick}
            shippingMethods={shippingMethods}
          />
        );
    }
  }, [
    currentView,
    userInfo,
    marketInfo,
    setUserInfo,
    setMarketInfo,
    handleUnlockClick,
    shippingMethods,
    labs,
    activeTab,
    upgrades,
    setUpgrades,
  ]);

  if (WebApp.platform !== "android" && WebApp.platform !== "ios") {
    return <MobileOnly />;
  }

  if (loading || isInitialLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <StyledApp data-theme="dark" id="buffer">
      <AppContainer>
        <TopMenu userInfo={userInfo} />
        <FlexBoxColNoGap id="mainView">{renderCurrentView()}</FlexBoxColNoGap>
        <FooterMenu setCurrentView={setCurrentView} currentView={currentView} />
      </AppContainer>
    </StyledApp>
  );
}
export default App;
