import React, { useState } from "react";
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

const LabContainer = styled.div`
  background-color: rgb(17 17 23);
  height: calc(100vh - 120px); // Adjust this value based on your layout
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1em;
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

  @media (min-width: 768px) {
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
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const DescriptionText = styled.p`
  color: #e2e8f0;
  font-size: 1rem;
  text-align: center;
`;

interface LabProps {
  userInfo: IUserInfo;
  labs: Record<string, ILab>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const Lab: React.FC<LabProps> = ({ userInfo, labs, setUserInfo }) => {
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
    setSelectedPlot(plot);
    setIsLabModalOpen(true);
  };

  const handleOpenPurchasedLabModal = (plot: LabPlot) => {
    setSelectedPlot(plot);
    setIsPurchasedLabModalOpen(true);
  };

  const handleOpenLabPlotModal = () => {
    setIsLabPlotModalOpen(true);
  };

  const handleCloseLabModal = () => {
    setIsLabModalOpen(false);
  };

  const handleCloseLabPlotModal = () => {
    setIsLabPlotModalOpen(false);
  };

  const handleClosePurchasedLabModal = () => {
    setIsPurchasedLabModalOpen(false);
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
      <DescriptionContainer>
        <DescriptionText>
          Expand your empire by producing resources
        </DescriptionText>
      </DescriptionContainer>
      <h2 className="text-lg font-bold p-2">Current Production per hour</h2>
      <CombinedProduction
        currentAmount={mapProductsToProduction(userInfo.products)}
        productionPerHour={production}
      />
      <Divider />
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
              <AddLabButton onClick={() => handleOpenLabModal(labPlot)}>
                <MdConstruction />
              </AddLabButton>
            </PlotItem>
          );
        })}
        <PlotItem>
          <div>Expand your territory</div>
          <AddPlotButton onClick={handleOpenLabPlotModal} className="skeleton">
            +
          </AddPlotButton>
        </PlotItem>
      </LabsGrid>
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
