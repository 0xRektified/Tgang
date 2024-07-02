import "./App.css";
import styled from "styled-components";
import { FlexBoxCol } from "./components/styled/styled";
import "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FooterMenu } from "./components/FooterMenu";
import { Home } from "./components/home/Home";
import { Shop } from "./components/Shop";
import { TopMenu } from "./components/TopMenu";
import { IUserInfo } from "./components/interfaces/user.interface";
import { useTelegramUserInfo } from "./hooks/useTelegramUserInfo";
import { userCashAmount } from "./mocks/backend.mock";
import { customerList } from "./mocks/backend.mock";
const StyledApp = styled.div``;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

// Statics.js
export function Statics() {
  return <h1 className="text-3xl font-bold underline">Hello Statics!</h1>;
}

function App() {
  const { sanitizedQuery } = useTelegramUserInfo();
  const [currentView, setCurrentView] = useState("home");
  const [cashAmount, setCashAmount] = useState<number>(userCashAmount);

  // @note Should be validate in the backend for any requests
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();

  useEffect(() => {
    const test = document.getElementById("mainView");
    if (test) {
      test.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (sanitizedQuery && sanitizedQuery.user) {
      console.log(`SET USER INFO`);
      setUserInfo({
        query_id: sanitizedQuery.query_id,
        user_id: sanitizedQuery.user.id,
        username: sanitizedQuery.user.username,
        language_code: sanitizedQuery.user.language_code,
        auth_date: sanitizedQuery.auth_date,
      });
    }
  }, [sanitizedQuery]);

  const renderCurrentView = (
    cashAmount: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    switch (currentView) {
      case "Base":
        return <Home setCashAmount={setCashAmount} cashAmount={cashAmount} />;
      case "Shop":
        return <Shop />;
      case "Statics":
        return <Statics />;
      default:
        return <Home setCashAmount={setCashAmount} cashAmount={cashAmount} />;
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
