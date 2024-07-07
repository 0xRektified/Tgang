import "./App.css";
import styled from "styled-components";
import { FlexBoxColNoGap } from "./components/styled/globalStyled";
import "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Shop } from "./components/shop/Shop";
import { TopMenu } from "./components/TopMenu";
import { Product } from "./components/interfaces/user.interface";
import { upgrades as mockUpgrades } from "./mocks/backend.mock";
import { Upgrades } from "./components/shop/utils/types";
import { useAuthAndFetchUserData } from "./hooks/useAuthAndFetchUserData";
import Loading from "./components/Loading";
import { useFetchCustomer } from "./hooks/useFetchCustomer";
import { useMarketData } from "./hooks/useMarketData";

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
  const { userInfo, loading, error } = useAuthAndFetchUserData();
  const { marketInfo } = useMarketData();
  const { customers, setCustomers } = useFetchCustomer();
  const [currentView, setCurrentView] = useState("Base");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<keyof Upgrades>("dealer");
  const [upgradesData, setUpgradesData] = useState<Upgrades>(mockUpgrades);

  useEffect(() => {
    const test = document.getElementById("mainView");
    if (test) {
      test.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      setCashAmount(userInfo.cashAmount);
      setProducts(userInfo.products);
    }
  }, [userInfo]);

  const handleUnlockClick = (tab: keyof Upgrades) => {
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
            products={products}
            customers={customers}
            setCustomers={setCustomers}
            setProducts={setProducts}
          />
        );
      case "Shop":
        return (
          <Shop
            setCashAmount={setCashAmount}
            cashAmount={cashAmount}
            products={products}
            setProducts={setProducts}
            activeTab={activeTab}
            upgradesData={upgradesData}
            setUpgradesData={setUpgradesData}
          />
        );
      case "Statics":
        return <Statics />;
      default:
        return (
          <Home
            setCashAmount={setCashAmount}
            cashAmount={cashAmount}
            products={products}
            customers={customers}
            setCustomers={setCustomers}
            setProducts={setProducts}
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
          products={products}
          setProducts={setProducts}
          setCashAmount={setCashAmount}
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
