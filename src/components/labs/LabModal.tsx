import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import { EProduct } from "../interfaces/product.interface";
import { useBuyLab } from "../../hooks/useBuyLab";
import { LabPlot, IUserInfo, Product } from "../interfaces/user.interface";
import {
  Button,
  CardContainer,
  CardContent,
  CardDescription,
  CardDetails,
  CardHeader,
  CardImage,
  CardInfoColumn,
  CardRequirement,
  CardTitle,
  NeonButton,
} from "../styled/renderUpgradesStyled";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: black;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

const LabItem = styled(CardContainer)``;

const LabButton = styled(NeonButton)`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
`;

const LockedButton = styled(Button)`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #cf2400;
  border-color: #cf2400;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef44449c;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #dc2626;
  }
`;

const LabImage = styled(CardImage)`
  width: 80px;
  height: 80px;
`;

const LabInfo = styled.div`
  color: white;
  text-align: left;
`;

const LabTitle = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const LabGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

interface LabModalProps {
  labs: Record<EProduct, ILab>;
  plotId: number;
  products: Product[];
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const LabModal: React.FC<LabModalProps> = ({
  labs,
  plotId,
  products,
  onClose,
  setUserInfo,
}) => {
  const { buyLab } = useBuyLab();

  const buyAndClose = (labProduct: EProduct, plotId: number) => {
    buyLab(
      {
        labProduct,
        plotId,
      },
      setUserInfo
    );
    onClose();
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <LabTitle>Select a Lab</LabTitle>
        <LabGrid>
          {Object.entries(labs).map(([labKey, lab]) => {
            const levelRequirement = lab.levelRequirement;
            let locked = false;
            const requiredProduct = products.find((u) => u.name === labKey);
            if (!requiredProduct) {
              locked = true;
            } else {
              locked = requiredProduct.level < levelRequirement;
            }
            return (
              <LabItem key={labKey} locked={locked}>
                <CardHeader>
                  <LabImage src={lab.image} alt={labKey} />
                  <CardDetails>
                    <CardInfoColumn>
                      <CardTitle>{labKey}</CardTitle>
                      <p>Cost: ${lab.labPrice}</p>
                      <p>Capacity: {lab.baseCapacity}</p>
                      <p>Production {lab.baseProduction}</p>
                    </CardInfoColumn>
                    <CardInfoColumn>
                      {locked ? (
                        <LockedButton disabled={locked}>Locked</LockedButton>
                      ) : (
                        <LabButton
                          onTouchStart={() =>
                            buyAndClose(labKey as EProduct, plotId)
                          }
                        >
                          Buy
                        </LabButton>
                      )}
                    </CardInfoColumn>
                  </CardDetails>
                </CardHeader>
                <CardContent>
                  <CardDescription>{lab.description}</CardDescription>
                  {locked ? (
                    <CardRequirement>
                      Requires {requiredProduct ? requiredProduct.name : labKey}{" "}
                      Level {levelRequirement}
                    </CardRequirement>
                  ) : (
                    <></>
                  )}
                </CardContent>
              </LabItem>
            );
          })}
        </LabGrid>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
