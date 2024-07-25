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

const LabContainer = styled.div`
  background-color: rgb(17 17 23);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  position: relative;
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

const CollectIcon = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: white;
  transition: transform 2s, opacity 2s;
  opacity: 1;
  background-color: red;
  height: 25px;
  width: 25px;

  &.collected {
    transform: translateX(-50%) translateY(-200px);
    opacity: 0;
  }
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
    [EProduct.WEED]: 0,
    [EProduct.COCAINE]: 0,
    [EProduct.METH]: 0,
    [EProduct.MUSHROOM]: 0,
    [EProduct.LSD]: 0,
    [EProduct.MDMA]: 0,
  };
  userInfo.labPlots.forEach((labPlot) => {
    switch (labPlot.lab?.product) {
      case EProduct.WEED:
        production[EProduct.WEED] += labPlot.lab.production;
        break;
      case EProduct.COCAINE:
        production[EProduct.COCAINE] += labPlot.lab.production;
        break;
      case EProduct.METH:
        production[EProduct.METH] += labPlot.lab.production;
        break;
      case EProduct.MUSHROOM:
        production[EProduct.MUSHROOM] += labPlot.lab.production;
        break;
      case EProduct.LSD:
        production[EProduct.LSD] += labPlot.lab.production;
        break;
      case EProduct.MDMA:
        production[EProduct.MDMA] += labPlot.lab.production;
        break;
    }
  });

  const mapProductsToProduction = (products: Product[]) => {
    const production = {
      [EProduct.WEED]: 0,
      [EProduct.COCAINE]: 0,
      [EProduct.MDMA]: 0,
      [EProduct.METH]: 0,
      [EProduct.LSD]: 0,
      [EProduct.MUSHROOM]: 0,
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
      <h2 className="text-lg font-bold p-2">Current Production per hour</h2>
      <CombinedProduction
        currentAmount={mapProductsToProduction(userInfo.products)}
        productionPerHour={production}
      />
      <Divider />
      <LabsGrid>
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
          plotId={selectedPlot?.plotId!}
          products={userInfo.products}
          onClose={handleCloseLabModal}
          setUserInfo={setUserInfo}
        />
      )}
      {isLabPlotModalOpen && (
        <LabPlotModal
          plotPrice={userInfo.labPlotPrice}
          onClose={handleCloseLabPlotModal}
          setUserInfo={setUserInfo}
        />
      )}
      {isPurchasedLabModalOpen && (
        <PurchasedLabModal
          plot={selectedPlot!}
          onClose={handleClosePurchasedLabModal}
          setUserInfo={setUserInfo}
        />
      )}
    </LabContainer>
  );
};

export default Lab;
