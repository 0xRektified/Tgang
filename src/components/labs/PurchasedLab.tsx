import React, { useEffect, useRef, useState } from "react";
import { GiHandTruck } from "react-icons/gi";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo, LabPlot } from "../interfaces/user.interface";
import { getUnixTime, set } from "date-fns";
import { useCollectLabProduct } from "../../hooks/useCollectLabProduct";

const PurchasedLabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
`;

const LabImage = styled.img`
  height: 4rem;
  width: 4rem;
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
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background-color: #2563eb;
  border-radius: 0.25rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1d4ed8;
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
  const collectTimeRef = useRef(collectTime);
  const { collectLabProduct } = useCollectLabProduct();

  const updateProduction = () => {
    const now = new Date();
    const diff = getUnixTime(now) - getUnixTime(collectTimeRef.current);
    const productionPerSecond = lab.production / 3600;
    const produced = Math.floor(productionPerSecond * diff);
    setProduction(produced);
  };

  const collectProduct = () => {
    collectLabProduct(plot.plotId, setUserInfo);
    setCollectTime(new Date());
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
      <VideoWrapper onClick={() => handleOpenPurchasedLabModal(plot)}>
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
          <progress
            className="progress progress-accent w-56"
            value={produced}
            max={lab.capacity}
          ></progress>
          <UpdateButton onClick={() => collectProduct()}>
            <GiHandTruck />
          </UpdateButton>
        </div>
      </ProgressContainer>
    </PurchasedLabContainer>
  );
};

export default PurchasedLab;
