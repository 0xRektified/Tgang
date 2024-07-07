export type ViewType = "Base" | "Shop" | "Statics";
import { GiShop } from "react-icons/gi";
import { GiThreeFriends } from "react-icons/gi";
import { GiPlayerBase } from "react-icons/gi";
import styled from "styled-components";

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #2d3748;
  z-index: 1000;
`;

interface FooterMenuProps {
  setCurrentView: (view: ViewType) => void;
  currentView: string;
}

export function FooterMenu({ setCurrentView, currentView }: FooterMenuProps) {
  return (
    <FooterContainer className="btm-nav">
      <button
        onClick={() => setCurrentView("Base")}
        className={currentView === "home" ? "active" : ""}
      >
        <GiPlayerBase />
        <span className="btm-nav-label">Base</span>
      </button>
      <button
        onClick={() => setCurrentView("Shop")}
        className={currentView === "warnings" ? "active" : ""}
      >
        <GiShop />
        <span className="btm-nav-label">Shop</span>
      </button>
      <button
        onClick={() => setCurrentView("Statics")}
        className={currentView === "statics" ? "active" : ""}
      >
        <GiThreeFriends />
        <span className="btm-nav-label">Referal</span>
      </button>
    </FooterContainer>
  );
}
