import "./App.css";
import styled from "styled-components";
import { FlexBoxColNoGap } from "./components/styled/globalStyled";
import "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Shop } from "./components/shop/Shop";
import { TopMenu } from "./components/TopMenu";
import Loading from "./components/Loading";
import { useInitializeGame } from "./hooks/useInitializeGame";
import Social from "./components/social/Social";
import Lab from "./components/labs/Lab";

const StyledApp = styled.div`
  background-image: url("/assets/street.webp");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  //@note handle loading and error properly
  const {
    userInfo,
    upgrades,
    marketInfo,
    labs,
    setUserInfo,
    setUpgrades,
    setLabs,
    loading,
    error,
  } = useInitializeGame();
  const [currentView, setCurrentView] = useState("Base");
  const [activeTab, setActiveTab] = useState<string>("dealer");

  useEffect(() => {
    const test = document.getElementById("mainView");
    if (test) {
      test.scrollIntoView();
    }
  }, []);

  const handleUnlockClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentView("Shop");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "Base":
        return (
          <Home
            userInfo={userInfo}
            marketInfo={marketInfo}
            setUserInfo={setUserInfo}
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
            setUserInfo={setUserInfo}
            setUpgrades={setUpgrades}
          />
        );
      default:
        return (
          <Social
            referralToken={userInfo!.referralToken}
            referredUsers={userInfo!.referredUsers}
            activeTab={activeTab}
          />
        );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <StyledApp data-theme="dark">
      <AppContainer>
        <div
          id="buffer"
          style={{ height: "500px", backgroundColor: "#1e2734" }}
        ></div>
        <TopMenu
          userInfo={userInfo}
          marketInfo={marketInfo}
          onUnlockClick={handleUnlockClick}
          setUserInfo={setUserInfo}
        />
        <FlexBoxColNoGap>{renderCurrentView()}</FlexBoxColNoGap>
        <FooterMenu setCurrentView={setCurrentView} currentView={currentView} />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
