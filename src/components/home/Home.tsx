import { useEffect, useState } from "react";
import styled from "styled-components";
import { IUserInfo } from "../interfaces/user.interface";
import { VisualArea } from "./VisualArea";
import { getRandomEmoji } from "./HomeBoard";
import { SwapInterface } from "./SwapInterface";
import { Pool } from "../../hooks/useFetchPools";

export const SkipButton = styled.button`
  background: grey;
  color: black;
  border-radius: 6px;
  padding: 0.6em 1em;
  font-size: 0.7em !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.8rem auto;
  width: 10em;
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(116, 185, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(116, 185, 255, 0);
    }
  }
  @media (max-width: 768px) {
    font-size: 0.8em;
    padding: 0.5em 0.8em;
  }
  display: block;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80vh;
  touch-action: none;
  position: relative;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
`;

interface HomeProps {
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  onUnlockClick: (tab?: string | undefined) => void;
  pools: Pool[];
  isContentLoaded: boolean;
}

export const Home: React.FC<HomeProps> = ({
  userInfo,
  setUserInfo,
  onUnlockClick,
  pools,
  isContentLoaded,
}) => {
  const [nextCustomer, setNextCustomer] = useState<string>(getRandomEmoji());
  const [animatingEmojis, setAnimatingEmojis] = useState<
    { emoji: string; id: number; offset: string }[]
  >([]);

  return (
    <HomeContainer>
      <SwapInterface
        pools={pools || []}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    </HomeContainer>
  );
};