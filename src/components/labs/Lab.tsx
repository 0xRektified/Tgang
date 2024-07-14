import React, { useState } from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import LabModal from "./LabModal";
import PurchasedLab from "./PurchasedLab";
import { IUserInfo, LabPlot, Product, UserLab } from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";
import LabPlotModal from "./LabPlotModal";
import PurchasedLabModal from "./PurchasedLabModal";

const LabContainer = styled.div`
  background-color: #1c1c1e;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const ProductionRecap = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const ProductionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ProductionItem = styled.div`
  padding: 0.2rem;
  background-color: #374151;
  border-radius: 0.375rem;
  text-align: center;
  color: white;
`;

const LabsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const PlotItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  border-radius: 0.375rem;
  margin-top: 1em;
`;

const AddLabButton = styled.button`
  width: 5em;
  height: 100%;
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
`;

interface LabProps {
  labPlotPrice: number;
  labs: Record<string, ILab>;
  labPlots: LabPlot[];
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setLabPlots: React.Dispatch<React.SetStateAction<LabPlot[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const Lab: React.FC<LabProps> = ({ labPlotPrice, labs, labPlots, setCashAmount, setLabPlots, setUserInfo, setProducts }) => {
  const [isLabPlotModalOpen, setIsLabPlotModalOpen] = useState<boolean>(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState<boolean>(false);
  const [isPurchasedLabModalOpen, setIsPurchasedLabModalOpen] = useState<boolean>(false);
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

  const handleSelectLab = (lab: [string, ILab]) => {
    console.log("Selected Lab:", lab);
    setIsLabModalOpen(false);
  };

  const handleUpdateProduction = (lab: UserLab) => {
    console.log("Update Production for:", lab.title);
  };

  const handleUpdateCapacity = (lab: UserLab) => {
    console.log("Update Capacity for:", lab.title);
  };

  const handleCollectProduct = (lab: UserLab) => {
    console.log("Update Capacity for:", lab.title);
  };

  const production = {
    [EProduct.WEED]: 0,
    [EProduct.COCAINE]: 0,
    [EProduct.METH]: 0,
    [EProduct.HEROIN]: 0,
    [EProduct.LSD]: 0,
    [EProduct.MDMA]: 0,
  }
  labPlots.forEach((labPlot) => {
    switch (labPlot.lab?.product) {
      case EProduct.WEED:
        production[EProduct.WEED] = labPlot.lab.production;
        break;
      case EProduct.COCAINE:
        production[EProduct.COCAINE] = labPlot.lab.production;
        break;
      case EProduct.METH:
        production[EProduct.METH] = labPlot.lab.production;
        break;
      case EProduct.HEROIN:
        production[EProduct.HEROIN] = labPlot.lab.production;
        break;
      case EProduct.LSD:
        production[EProduct.LSD] = labPlot.lab.production;
        break;
      case EProduct.MDMA:
        production[EProduct.MDMA] = labPlot.lab.production;
        break;
    }
  })

  return (
    <LabContainer>
      <ProductionRecap>
        <h2 className="text-lg font-bold">Current Production</h2>
        <ProductionGrid>
          <ProductionItem>Weed {production[EProduct.WEED]}/H</ProductionItem>
          <ProductionItem>Cocaine {production[EProduct.COCAINE]}/H</ProductionItem>
          <ProductionItem>Meth {production[EProduct.METH]}/H</ProductionItem>
          <ProductionItem>Heroin {production[EProduct.HEROIN]}/H</ProductionItem>
          <ProductionItem>LSD {production[EProduct.LSD]}/H</ProductionItem>
          <ProductionItem>MDMA {production[EProduct.MDMA]}/H</ProductionItem>
        </ProductionGrid>
      </ProductionRecap>
      <div className="divider"></div>
      <LabsGrid>
        {
          labPlots.map((labPlot) => {
            if (labPlot.lab) {
              return (
                <PurchasedLab
                  key={labPlot.lab.product}
                  plot={labPlot}
                  setLabPlots={setLabPlots}
                  setProducts={setProducts}
                  setUserInfo={setUserInfo}
                  handleOpenPurchasedLabModal={handleOpenPurchasedLabModal}
                />
              );
            }
            return (
              <PlotItem>
                <AddLabButton onClick={() => handleOpenLabModal(labPlot)}></AddLabButton>
              </PlotItem>
            );
          })
        }
        <PlotItem>
          <AddLabButton onClick={handleOpenLabPlotModal}>+</AddLabButton>
        </PlotItem>
      </LabsGrid>
      {isLabModalOpen && (
        <LabModal
          labs={labs}
          plotId={selectedPlot?.plotId!}
          onClose={handleCloseLabModal}
          setCashAmount={setCashAmount}
          setLabPlots={setLabPlots}
          setUserInfo={setUserInfo}
        />
      )}
      {isLabPlotModalOpen && (
        <LabPlotModal
          plotPrice={labPlotPrice}
          onClose={handleCloseLabPlotModal}
          setCashAmount={setCashAmount}
          setLabPlots={setLabPlots}
          setUserInfo={setUserInfo}
        />
      )}
      {isPurchasedLabModalOpen && (
        <PurchasedLabModal
          plot={selectedPlot!}
          onClose={handleClosePurchasedLabModal}
          setCashAmount={setCashAmount}
          setLabPlots={setLabPlots}
          setUserInfo={setUserInfo}
        />
      )}
    </LabContainer>
  );
};

export default Lab;
