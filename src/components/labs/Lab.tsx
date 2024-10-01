import WebApp from "@twa-dev/sdk";
import { useState } from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import LabModal from "./LabModal";
import PurchasedLab from "./PurchasedLab";
import { IUserInfo, LabPlot, Product } from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";
import LabPlotModal from "./LabPlotModal";
import PurchasedLabModal from "./PurchasedLabModal";
import { MdConstruction } from "react-icons/md";
import CombinedProduction from "./Production";
import { useBuyLabPlot } from "../../hooks/useBuyLabPlot";
import { ApiToast } from "../ApiToast";
import { useBuyLab } from "../../hooks/useBuyLab";
import { TouchPoint } from "../utils/types";
import { useUpgradeLabCapacity } from "../../hooks/useUpgradeLabCapacity";
import { useUpgradeLabProduction } from "../../hooks/useUpgradeLabProduction";
import { useTutorial } from "../../hooks/useTutorial";
import { FlexBoxRow } from "../styled/globalStyled";
import { SkipButton } from "../home/Home";

const LabContainer = styled.div`
  background-color: #1c1c1e;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1em 1em 2em;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  > * {
    width: 100%;
  }
`;

const LabsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  overflow-y: auto;
  max-height: calc(80vh - 150px);
  padding-bottom: 2rem;
  grid @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #4a4a4a;
  margin: 0.5rem 0;
`;

const PlotItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 8rem;
  border-radius: 0.375rem;
  margin-top: 1em;
  text-align: center;
  color: white;
`;

const AddLabButton = styled.button`
  width: 5em;
  height: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #a392164a;
  border-radius: 0.375rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a392164a;
  }

  & > div {
    font-size: 0.75rem;
  }

  & > svg {
    font-size: 2rem;
  }
`;

const AddPlotButton = styled.button`
  width: 5em;
  height: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #16a34a1f;
  border-radius: 0.375rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #15803d;
  }

  & > div {
    font-size: 0.75rem;
  }

  & > svg {
    font-size: 2rem;
  }
`;

const DescriptionContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem;
`;

const DescriptionText = styled.p`
  color: #e2e8f0;
  font-size: 0.8rem;
  text-align: center;
`;

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  padding-top: 5em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TutorialText = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  margin: 1rem 0;
  max-width: 80%;
`;

const HighlightedPlotItem = styled(PlotItem)`
  position: relative;
  z-index: 1001;
  pointer-events: auto;
  animation: bounce 2s infinite;
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7px);
    }
  }
`;

interface LabProps {
  userInfo: IUserInfo;
  labs: Record<string, ILab>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  tutorial: ReturnType<typeof useTutorial>;
  handleLabTutorialComplete: () => void;
}

export const Lab: React.FC<LabProps> = ({
  userInfo,
  labs,
  setUserInfo,
  tutorial,
  handleLabTutorialComplete,
}) => {
  const [isLabPlotModalOpen, setIsLabPlotModalOpen] = useState<boolean>(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState<boolean>(false);
  const [isPurchasedLabModalOpen, setIsPurchasedLabModalOpen] =
    useState<boolean>(false);
  const [selectedPlot, setSelectedPlot] = useState<LabPlot>();
  const [showBalanceErrorToast, setShowBalanceErrorToast] =
    useState<boolean>(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);

  const {
    buyLabPlot,
    loading: labPlotLoading,
    error: labPlotError,
    successMessage: labPlotSuccessMessage,
  } = useBuyLabPlot();
  const {
    buyLab,
    loading: labLoading,
    error: labError,
    successMessage: labSuccessMessage,
  } = useBuyLab();

  const {
    upgradeLabCapacity,
    loading: labCapacityLoading,
    error: labCapacityError,
    successMessage: labCapacitySuccessMessage,
  } = useUpgradeLabCapacity();
  const {
    upgradeLabProduction,
    loading: labProductionLoading,
    error: labProductionError,
    successMessage: labProductionSuccessMessage,
  } = useUpgradeLabProduction();

  const handleOpenLabModal = (plot: LabPlot) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setSelectedPlot(plot);
    setIsLabModalOpen(true);
    if (tutorial.tutorialStep === 3) {
      tutorial.onTutorialProgress();
      tutorial.tutorialStep = 4;
    }
  };

  const handleOpenPurchasedLabModal = (plot: LabPlot) => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setSelectedPlot(plot);
    setIsPurchasedLabModalOpen(true);
  };

  const handleOpenLabPlotModal = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setIsLabPlotModalOpen(true);
  };

  const handleCloseLabModal = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setIsLabModalOpen(false);
  };

  const handleCloseLabPlotModal = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setIsLabPlotModalOpen(false);
  };

  const handleClosePurchasedLabModal = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setIsPurchasedLabModalOpen(false);
  };

  const handleSkipTutorial = () => {
    tutorial.setTutorialCompleted(true);
    tutorial.tutorialCompleted = true;
  };

  const production = {
    [EProduct.HERB]: 0,
    [EProduct.MUSHROOM]: 0,
    [EProduct.ACID]: 0,
    [EProduct.PILL]: 0,
    [EProduct.CRYSTAL]: 0,
    [EProduct.POWDER]: 0,
  };

  userInfo.labPlots.forEach((labPlot) => {
    switch (labPlot.lab?.product) {
      case EProduct.HERB:
        production[EProduct.HERB] += labPlot.lab.production;
        break;
      case EProduct.MUSHROOM:
        production[EProduct.MUSHROOM] += labPlot.lab.production;
        break;
      case EProduct.ACID:
        production[EProduct.ACID] += labPlot.lab.production;
        break;
      case EProduct.PILL:
        production[EProduct.PILL] += labPlot.lab.production;
        break;
      case EProduct.CRYSTAL:
        production[EProduct.CRYSTAL] += labPlot.lab.production;
        break;
      case EProduct.POWDER:
        production[EProduct.POWDER] += labPlot.lab.production;
        break;
    }
  });

  const mapProductsToProduction = (products: Product[]) => {
    const production = {
      [EProduct.HERB]: 0,
      [EProduct.MUSHROOM]: 0,
      [EProduct.ACID]: 0,
      [EProduct.PILL]: 0,
      [EProduct.CRYSTAL]: 0,
      [EProduct.POWDER]: 0,
    };

    products.forEach((product) => {
      if (production.hasOwnProperty(product.name)) {
        production[product.name] = product.quantity;
      }
    });

    return production;
  };
  return (
    <LabContainer>
      <CombinedProduction
        currentAmount={mapProductsToProduction(userInfo.products)}
        productionPerHour={production}
      />

      <Divider />
      <DescriptionContainer>
        <DescriptionText>
          Expand your empire by producing resources
        </DescriptionText>
      </DescriptionContainer>
      {!tutorial.tutorialCompleted && tutorial.tutorialStep === 3 ? (
        <TutorialOverlay>
          <TutorialText>CLICK ON THE "BUILD LAB" ICON 👇</TutorialText>
          <FlexBoxRow className="w-full justify-center">
            {userInfo.labPlots.map((labPlot) => {
              if (!labPlot.lab) {
                return (
                  <HighlightedPlotItem key={labPlot.plotId}>
                    <AddLabButton
                      onClick={() => handleOpenLabModal(labPlot)}
                      className="build-new-lab-button tutorial-highlight"
                    >
                      <MdConstruction />
                    </AddLabButton>
                  </HighlightedPlotItem>
                );
              }
              return null;
            })}
          </FlexBoxRow>
          <TutorialText>Collect resources as 🌱 supply grows.</TutorialText>
          <SkipButton onClick={handleSkipTutorial}>Skip Tutorial</SkipButton>
        </TutorialOverlay>
      ) : (
        <LabsGrid className="scrollable-content">
          {userInfo.labPlots.map((labPlot) => {
            if (labPlot.lab) {
              return (
                <PurchasedLab
                  key={labPlot.plotId}
                  plot={labPlot}
                  setUserInfo={setUserInfo}
                  handleOpenPurchasedLabModal={handleOpenPurchasedLabModal}
                />
              );
            }
            return (
              <PlotItem key={labPlot.plotId}>
                <div>Build a new lab</div>
                <AddLabButton
                  onClick={() => handleOpenLabModal(labPlot)}
                  className={`build-new-lab-button ${
                    tutorial.tutorialStep === 4 ? "tutorial-highlight" : ""
                  }`}
                >
                  <MdConstruction />
                </AddLabButton>
              </PlotItem>
            );
          })}
          <PlotItem>
            <div>Expand your territory</div>
            <AddPlotButton
              onClick={handleOpenLabPlotModal}
              className="skeleton"
            >
              +
            </AddPlotButton>
          </PlotItem>
        </LabsGrid>
      )}

      {isLabModalOpen && (
        <LabModal
          labs={labs}
          userInfo={userInfo}
          plotId={selectedPlot?.plotId!}
          products={userInfo.products}
          onClose={handleCloseLabModal}
          setUserInfo={setUserInfo}
          setTouchPoints={setTouchPoints}
          setShowBalanceErrorToast={setShowBalanceErrorToast}
          buyLab={buyLab}
          tutorial={tutorial}
          handleLabTutorialComplete={handleLabTutorialComplete}
        />
      )}
      {isLabPlotModalOpen && (
        <LabPlotModal
          plotPrice={userInfo.labPlotPrice}
          onClose={handleCloseLabPlotModal}
          setUserInfo={setUserInfo}
          buyLabPlot={buyLabPlot}
        />
      )}
      {isPurchasedLabModalOpen && (
        <PurchasedLabModal
          plot={selectedPlot!}
          onClose={handleClosePurchasedLabModal}
          setUserInfo={setUserInfo}
          upgradeLabCapacity={upgradeLabCapacity}
          upgradeLabProduction={upgradeLabProduction}
        />
      )}
      <ApiToast
        loading={
          labPlotLoading ||
          labLoading ||
          labCapacityLoading ||
          labProductionLoading
        }
        error={
          labPlotError || labError || labCapacityError || labProductionError
        }
        successMessage={
          labPlotSuccessMessage ||
          labSuccessMessage ||
          labCapacitySuccessMessage ||
          labProductionSuccessMessage
        }
      />
    </LabContainer>
  );
};

export default Lab;
