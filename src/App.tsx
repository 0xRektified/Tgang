import "./App.css";
import styled from "styled-components";
import { FlexBoxCol } from "./components/styled/globalStyled";
import "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Shop } from "./components/shop/Shop";
import { TopMenu } from "./components/TopMenu";
import { IUserInfo } from "./components/interfaces/user.interface";
import { useTelegramUserInfo } from "./hooks/useTelegramUserInfo";
import { userCashAmount } from "./mocks/backend.mock";
import { productsData, customerList, upgrades } from "./mocks/backend.mock";
import { Product } from "./components/home/utils/types";
import { Upgrades } from "./components/shop/utils/types";

const StyledApp = styled.div``;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export function Statics() {
  return <h1 className="text-3xl font-bold underline">Hello Statics!</h1>;
}

function App() {
  const { sanitizedQuery } = useTelegramUserInfo();
  const [currentView, setCurrentView] = useState("home");
  const [cashAmount, setCashAmount] = useState<number>(userCashAmount);
  const [products, setProducts] = useState<Product[]>(productsData);
  const [activeTab, setActiveTab] = useState<keyof Upgrades>("dealer");
  const [upgradesData, setUpgradesData] = useState<Upgrades>(upgrades);

  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();

  useEffect(() => {
    const test = document.getElementById("mainView");
    if (test) {
      test.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (sanitizedQuery && sanitizedQuery.user) {
      setUserInfo({
        query_id: sanitizedQuery.query_id,
        user_id: sanitizedQuery.user.id,
        username: sanitizedQuery.user.username,
        language_code: sanitizedQuery.user.language_code,
        auth_date: sanitizedQuery.auth_date,
      });
    }
  }, [sanitizedQuery]);

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
            setProducts={setProducts}
            onUnlockClick={handleUnlockClick}
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
            setProducts={setProducts}
            onUnlockClick={handleUnlockClick}
          />
        );
    }
  };

  return (
    <StyledApp data-theme="dark">
      <AppContainer>
        <div id="buffer" style={{ height: "500px" }}></div>
        <TopMenu
          userInfo={userInfo}
          cashAmount={cashAmount}
          customerNbr={customerList.length}
        />
        <FlexBoxCol>{renderCurrentView(cashAmount, setCashAmount)}</FlexBoxCol>
        <FooterMenu setCurrentView={setCurrentView} currentView={currentView} />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
