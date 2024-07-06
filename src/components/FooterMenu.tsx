import React from "react";
export type ViewType = "Base" | "Shop" | "Statics";
import { GiShop } from "react-icons/gi";
import { GiThreeFriends } from "react-icons/gi";
import { GiPlayerBase } from "react-icons/gi";
interface FooterMenuProps {
  setCurrentView: (view: ViewType) => void;
  currentView: string;
}

export function FooterMenu({ setCurrentView, currentView }: FooterMenuProps) {
  console.log(currentView);
  return (
    <div className="btm-nav">
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
    </div>
  );
}
