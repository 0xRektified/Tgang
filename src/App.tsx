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
import mixpanel from "mixpanel-browser";
import { useTutorial } from "./hooks/useTutorial";
import Leaderboard from "./components/Leaderboard";

const StyledApp = styled.div`
  background-image: url("/assets/home/street.webp");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

const AppContainer = styled.div`
  max-width: 750px;
  margin: 0 auto;
  padding-bottom: 60px;
`;

const TopMenuWrapper = styled.div`
  position: relative;
  z-index: 20;
`;

const ContentWrapper = styled.div`
  position: relative;
`;

function App() {
  const {
    userInfo,
    upgrades,
    marketInfo,
    labs,
    shippingMethods,
    socials,
    setUserInfo,
    setUpgrades,
    setMarketInfo,
    loading,
    error,
    signup,
  } = useInitializeGame();
  const tutorial = useTutorial();

  useEffect(() => {
    const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (mixpanelToken) {
      mixpanel.init(mixpanelToken);
      mixpanel.set_config({ debug: true });
    } else {
      console.warn("Mixpanel token not found in environment variables");
    }
  }, []);

  const [currentView, setCurrentView] = useState("Base");
  const [activeTab, setActiveTab] = useState<string>("dealer");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCombinedModalOpen, setIsCombinedModalOpen] = useState(false);

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

  const handleSetCurrentView = useCallback(
    (tab: string) => {
      if (userInfo && userInfo.id) {
        mixpanel.identify(userInfo.id.toString());
      }
      mixpanel.track("Page View", { page: tab });
      setCurrentView(tab);
    },
    [userInfo, tutorial],
  );

  const handleHomeTutorialComplete = useCallback(() => {
    setCurrentView("Lab");
  }, [tutorial]);

  const handleLabTutorialComplete = useCallback(() => {
    tutorial.onTutorialProgress();
    tutorial.tutorialStep = 5;
    setCurrentView("Airdrop");
  }, [tutorial]);

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
            signup={signup}
            tutorial={tutorial}
            handleTutorialComplete={handleHomeTutorialComplete}
            isCombinedModalOpen={isCombinedModalOpen}
            closeCombinedModal={() => setIsCombinedModalOpen(false)}
          />
        );
      case "Lab":
        return (
          <Lab
            userInfo={userInfo}
            labs={labs!}
            setUserInfo={setUserInfo}
            tutorial={tutorial}
            handleLabTutorialComplete={handleLabTutorialComplete}
          />
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
            socials={socials!}
            setUserInfo={setUserInfo}
            tutorial={tutorial}
          />
        );
      case "Pvp":
        return <Pvp userInfo={userInfo} />;
      case "Leaderboard":
        return <Leaderboard userInfo={userInfo} />;
      default:
        return (
          <Home
            userInfo={userInfo}
            marketInfo={marketInfo}
            setUserInfo={setUserInfo}
            onUnlockClick={handleUnlockClick}
            shippingMethods={shippingMethods}
            signup={signup}
            tutorial={tutorial}
            handleTutorialComplete={handleHomeTutorialComplete}
            isCombinedModalOpen={isCombinedModalOpen}
            closeCombinedModal={() => setIsCombinedModalOpen(false)}
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
        <TopMenuWrapper>
          <TopMenu userInfo={userInfo} setCurrentView={handleSetCurrentView} />
        </TopMenuWrapper>
        <ContentWrapper>
          <FlexBoxColNoGap id="mainView">{renderCurrentView()}</FlexBoxColNoGap>
        </ContentWrapper>
        <FooterMenu
          setCurrentView={handleSetCurrentView}
          currentView={currentView}
        />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
