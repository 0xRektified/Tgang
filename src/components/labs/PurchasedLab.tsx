import React, { useEffect, useRef, useState } from "react";
import { GiHandTruck } from "react-icons/gi";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo, LabPlot } from "../interfaces/user.interface";
import { getUnixTime } from "date-fns";
import { useCollectLabProduct } from "../../hooks/useCollectLabProduct";
import WebApp from "@twa-dev/sdk";

const PurchasedLabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  position: relative;
`;

const LabInfo = styled.div`
  text-align: center;
  color: white;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const UpdateButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #2563eb;
  border-radius: 0.375rem;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #1d4ed8;
    transform: scale(1.1);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
`;

const StyledVideo = styled.video.attrs<{ isVideoLoaded: boolean }>({})<{
  isVideoLoaded: boolean;
}>`
  width: 100%;
  height: 100%;
  display: ${({ isVideoLoaded }) => (isVideoLoaded ? "block" : "none")};
`;

const PlaceholderImage = styled.div.attrs<{
  poster: string;
  isVideoLoaded: boolean;
}>({})<{ poster: string; isVideoLoaded: boolean }>`
  width: 100%;
  height: 100%;
  background: url(${({ poster }) => poster}) no-repeat center center;
  background-size: cover;
  display: ${({ isVideoLoaded }) => (isVideoLoaded ? "none" : "block")};
`;

interface PurchasedLabProps {
  plot: LabPlot;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  handleOpenPurchasedLabModal: (plot: LabPlot) => void;
}

const PurchasedLab: React.FC<PurchasedLabProps> = ({
  plot,
  setUserInfo,
  handleOpenPurchasedLabModal,
}) => {
  const lab = plot.lab!;
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [produced, setProduction] = useState(lab.produced);
  const [collectTime, setCollectTime] = useState(lab.collectTime);
  const [progress, setProgress] = useState(0);
  const [collecting, setCollecting] = useState(false);
  const collectTimeRef = useRef(collectTime);
  const { collectLabProduct } = useCollectLabProduct();
  const [noProductAnimation, setNoProductAnimation] = useState(false);

  const updateProduction = () => {
    const now = new Date();
    const diff = getUnixTime(now) - getUnixTime(collectTimeRef.current);
    const productionPerSecond = lab.production / 3600;
    const totalProduction = productionPerSecond * diff;
    const produced = Math.floor(totalProduction);
    const fractionalProgress = totalProduction - produced;
    if (produced < 0) {
      setProduction(0);
      setProgress(0);
    } else if (produced > lab.capacity) {
      setProduction(lab.capacity);
      setProgress(1);
    } else {
      setProduction(produced);
      setProgress(fractionalProgress);
    }
  };

  const collectProduct = () => {
    if (produced > 0) {
      setCollecting(true);
      setNoProductAnimation(true);

      const hapticCount = Math.min(produced, 10);
      const interval = 1000 / hapticCount;
      for (let i = 0; i < hapticCount; i++) {
        setTimeout(
          () => WebApp.HapticFeedback.impactOccurred("heavy"),
          i * interval
        );
      }
      setTimeout(() => {
        setCollecting(false);
        collectLabProduct(plot.plotId, setUserInfo);
        setCollectTime(new Date());
      }, 1000);
      setTimeout(() => {
        setNoProductAnimation(false);
      }, 500);
    } else {
    }
  };

  useEffect(() => {
    collectTimeRef.current = collectTime;
  }, [collectTime]);

  useEffect(() => {
    const interval = setInterval(() => updateProduction(), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <PurchasedLabContainer>
      <VideoWrapper
        onClick={collectProduct}
        className={noProductAnimation ? "animate-resize" : ""}
      >
        <PlaceholderImage
          poster={`/assets/weed_lab_2.png`}
          isVideoLoaded={isVideoLoaded}
        />
        <StyledVideo
          src={`/assets/weed_lab_video.mp4`}
          poster={`/assets/weed_lab_2.png`}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          isVideoLoaded={isVideoLoaded}
        />
      </VideoWrapper>
      <LabInfo>{lab.product}</LabInfo>
      <LabInfo>
        {produced}/{lab.capacity}
      </LabInfo>
      <ProgressContainer>
        <div className="flex items-center mt-2">
          <UpdateButton onClick={() => handleOpenPurchasedLabModal(plot)}>
            <GiHandTruck />
          </UpdateButton>
          <progress
            className="progress progress-accent w-56 ml-2"
            value={progress}
            max={1}
          ></progress>
          {Math.floor(progress * 100)}%
        </div>
      </ProgressContainer>
      {collecting &&
        Array.from({ length: produced }).map((_, index) => {
          const delay = (index * 1000) / produced;
          return (
            <div
              key={index}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-6 w-6 animate-move-up"
              style={{
                fontSize: "2rem",
                color: "white",
                animationDelay: `${delay}ms`,
              }}
            >
              🌱
            </div>
          );
        })}
    </PurchasedLabContainer>
  );
};

export default PurchasedLab;
