import React, { useState, useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import styled from "styled-components";

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999; // Ensure this is higher than TopMenu and FooterMenu
  background-color: #000; // Optional: add a background color
`;

const LoadingContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("/assets/loading_new.webp");
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
`;

const ContentWrapper = styled.div`
  position: relative;
  padding-top: 16em;
  z-index: 10;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingSpinner = styled.span`
  &.loading {
    width: 4rem;
    height: 4rem;
    border-width: 0.5rem;
  }
`;

const LoadingText = styled.h2`
  font-size: 1.2rem;
`;

const InfoSection = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 1rem;
  padding: 1rem;
`;

const InfoSectionTitle = styled.h1`
  color: white;
  font-weight: bold;
`;

const SocialInfoContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  z-index: 10;
  text-align: center;
  color: white;
  font-size: 1.4rem;
  font-weight: 800;
`;

const SocialSubtitle = styled.b`
  display: block;
  margin-bottom: 1rem;
`;
const TipContainer = styled.div`
  position: absolute;
  bottom: 6rem; // Adjust this value to position above the SocialInfoContainer
  left: 0;
  right: 0;
  z-index: 10;
  text-align: center;
  color: white;
`;

const SocialTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TipText = styled.p`
  font-size: 1rem;
  font-style: italic;
  margin-bottom: 1rem;
`;

const SocialIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  margin: 0 0.5rem;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const NewsContainer = styled.div`
  text-align: center;
  color: white;
  padding: 1rem;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const NewsContent = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
`;
const tips = [
  "Remember to claim your daily rewards!",
  "Join our Discord community for the latest updates.",
  "Participate in events to earn exclusive rewards.",
  "Don't forget to upgrade your characters regularly.",
  "Check the marketplace for rare items and deals.",
];

interface LoadingProps {
  isContentLoaded: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isContentLoaded }) => {
  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  if (isContentLoaded) {
    return null;
  }

  return (
    <LoadingOverlay>
      <LoadingContainer>
        <BackgroundImage />
        <ContentWrapper>
          <NewsContainer>
            <NewsContent>
              Checkout the new Crafting section and boost your Pvp powers !
            </NewsContent>
          </NewsContainer>
          <LoadingSpinner className="loading loading-spinner loading-md" />
          <LoadingText>Loading ...</LoadingText>
        </ContentWrapper>
        {/* <TipContainer>
          <TipText>Tips: {randomTip}</TipText>
        </TipContainer> */}
        <SocialInfoContainer>
          <SocialSubtitle>More info on official channels</SocialSubtitle>
          <div>
            <SocialIcon>
              <FaTelegram />
            </SocialIcon>
            <SocialIcon>
              <RiTwitterXLine />
            </SocialIcon>
          </div>
        </SocialInfoContainer>
      </LoadingContainer>
    </LoadingOverlay>
  );
};

export default Loading;
