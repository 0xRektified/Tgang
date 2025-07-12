import "./App.css";
import styled from "styled-components";
import "@twa-dev/sdk";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Upgrade } from "./components/upgrade/Upgrade";
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
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AppContainer = styled.div`
  max-width: 750px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function App() {
  const {
    userInfo,
    upgrades,
    labs,
    pools,
    socials,
    setUserInfo,
    setUpgrades,
    loading,
    error,
    signup,
  } = useInitializeGame();
  const tutorial = useTutorial();

  const [currentView, setCurrentView] = useState("Base");
  const [activeTab, setActiveTab] = useState<string>("dealer");
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    initializeApp();
    return () => {
      cleanupApp();
    };
  }, []);

  useEffect(() => {
    const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (mixpanelToken) {
      mixpanel.init(mixpanelToken);
      mixpanel.set_config({ debug: true });
    } else {
      console.warn("Mixpanel token not found in environment variables");
    }
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const timer = setTimeout(() => {
        setIsContentLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, error]);

  const handleUnlockClick = useCallback((tab?: string) => {
    if (tab) {
      setActiveTab(tab);
    }
    setCurrentView("Upgrade");
  }, []);

  const handleSetCurrentView = useCallback(
    (tab: string) => {
      WebApp.HapticFeedback.impactOccurred("heavy");

      if (userInfo && userInfo.id) {
        mixpanel.identify(userInfo.id.toString());
      }
      mixpanel.track("Page View", { page: tab });
      setCurrentView(tab);
    },
    [userInfo],
  );

  const handleHomeTutorialComplete = useCallback(() => {
    setCurrentView("Lab");
  }, []);

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
            setUserInfo={setUserInfo}
            onUnlockClick={handleUnlockClick}
            pools={pools}
            isContentLoaded={isContentLoaded}
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
      case "Upgrade":
        return (
          <Upgrade
            userInfo={userInfo}
            activeTab={activeTab}
            upgradesData={upgrades}
            setUserInfo={setUserInfo}
            setUpgrades={setUpgrades}
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
        return (
          <Pvp
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            socials={socials!}
            referralToken={userInfo!.referralToken}
          />
        );
      case "Leaderboard":
        return <Leaderboard userInfo={userInfo} />;
      default:
        return (
          <Home
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onUnlockClick={handleUnlockClick}
            pools={pools}
            isContentLoaded={isContentLoaded}
          />
        );
    }
  }, [
    currentView,
    userInfo,
    setUserInfo,
    handleUnlockClick,
    pools,
    labs,
    activeTab,
    upgrades,
    setUpgrades,
    tutorial,
    isContentLoaded,
  ]);

  const memoizedUserInfo = useMemo(() => userInfo, [userInfo]);

  if (WebApp.platform !== "android" && WebApp.platform !== "ios") {
    return <MobileOnly />;
  }

  const memoizedSetCurrentView = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  return (
    <StyledApp data-theme="dark">
      {!isContentLoaded && <Loading isContentLoaded={isContentLoaded} />}
      <AppContainer>
        <TopMenu
          userInfo={userInfo || undefined}
          setCurrentView={memoizedSetCurrentView}
        />
        <ContentWrapper>{renderCurrentView()}</ContentWrapper>
        <FooterMenu
          setCurrentView={handleSetCurrentView}
          currentView={currentView}
        />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
