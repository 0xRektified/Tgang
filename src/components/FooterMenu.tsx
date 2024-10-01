import styled from "styled-components";
import { GiShop, GiThreeFriends, GiPlayerBase } from "react-icons/gi";
import { ImLab } from "react-icons/im";
import { GiPistolGun } from "react-icons/gi";

// Styled components
const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1c1c1e;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.7);
  border-top: 1px solid #333;
`;

const FooterButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.active ? "#FFD700" : "#8e8e93")};
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1em;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ffd700;
  }

  .btm-nav-label {
    font-size: 0.8em;
    margin-top: 0.2rem;
  }

  svg {
    font-size: 1.5em;
  }
`;

const NewLabel = styled.span`
  position: absolute;
  top: -15px;
  right: -10px;
  background-color: #10c810;
  color: #000000;
  font-size: 0.6em;
  padding: 2px 4px;
  border-radius: 10px;
  font-weight: bold;
`;

const FooterButtonWrapper = styled.div`
  position: relative;
`;

interface FooterMenuProps {
  setCurrentView: (view: string) => void;
  currentView: string;
}

export const FooterMenu: React.FC<FooterMenuProps> = ({
  setCurrentView,
  currentView,
}) => {
  return (
    <FooterContainer>
      <FooterButton
        onClick={() => setCurrentView("Base")}
        active={currentView === "Base"}
      >
        <GiPlayerBase />
        <span className="btm-nav-label">Base</span>
      </FooterButton>
      <FooterButton
        onClick={() => setCurrentView("Lab")}
        active={currentView === "Lab"}
      >
        <ImLab />
        <span className="btm-nav-label">Lab</span>
      </FooterButton>
      <FooterButton
        onClick={() => setCurrentView("Upgrade")}
        active={currentView === "Upgrade"}
      >
        <GiShop />
        <span className="btm-nav-label">Upgrade</span>
      </FooterButton>
      <FooterButton
        onClick={() => setCurrentView("Airdrop")}
        active={currentView === "Airdrop"}
      >
        <img src={`/assets/coin.gif`} alt="Logo" style={{ maxWidth: "25px" }} />
        <span className="btm-nav-label text-white-grey">Airdrop </span>
      </FooterButton>
      <FooterButtonWrapper>
        <FooterButton
          onClick={() => setCurrentView("Pvp")}
          active={currentView === "Pvp"}
        >
          <GiPistolGun />
          <span className="btm-nav-label text-white-grey">Pvp</span>
        </FooterButton>
        <NewLabel>NEW</NewLabel>
      </FooterButtonWrapper>
    </FooterContainer>
  );
};

export default FooterMenu;
