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

export function Statics() {
  return <h1 className="text-3xl font-bold underline">Hello Statics!</h1>;
}

function App() {
  //@note handle loading and error properly
  const {
    cashAmount,
    carryAmount,
    products,
    userInfo,
    upgrades,
    customers,
    marketInfo,
    nbrOfUserInBatch,
    setUserInfo,
    setProducts,
    setUpgrades,
    setCustomers,
    setCashAmount,
    setCarryAmount,
    fetchCustomers,
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

  const renderCurrentView = (
    cashAmount: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    switch (currentView) {
      case "Base":
        return (
          <Home
            setCashAmount={setCashAmount}
            cashAmount={cashAmount}
            setCarryAmount={setCarryAmount}
            carryAmount={cashAmount}
            products={products}
            customers={customers}
            nbrOfUserInBatch={nbrOfUserInBatch}
            setCustomers={setCustomers}
            setProducts={setProducts}
            fetchCustomers={fetchCustomers}
          />
        );
      case "Lab":
        return <Lab />;
      case "Shop":
        return (
          <Shop
            setCashAmount={setCashAmount}
            cashAmount={cashAmount}
            activeTab={activeTab}
            upgradesData={upgrades}
            setUpgrades={setUpgrades}
            setUserInfo={setUserInfo}
          />
        );
      case "Statics":
        return <Statics />;
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
          cashAmount={cashAmount}
          carryAmount={carryAmount}
          products={products}
          setProducts={setProducts}
          setCashAmount={setCashAmount}
          setCarryAmount={setCarryAmount}
          onUnlockClick={handleUnlockClick}
        />
        <FlexBoxColNoGap>
          {renderCurrentView(cashAmount, setCashAmount)}
        </FlexBoxColNoGap>
        <FooterMenu setCurrentView={setCurrentView} currentView={currentView} />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
