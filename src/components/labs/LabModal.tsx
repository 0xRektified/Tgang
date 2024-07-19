import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import { EProduct } from "../interfaces/product.interface";
import { useBuyLab } from "../../hooks/useBuyLab";
import { LabPlot, IUserInfo, Product } from "../interfaces/user.interface";

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
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

const LabItem = styled.div`
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
`;

const LabButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #10b981;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #059669;
    transform: scale(1.05);
  }
`;

const LockedButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #cf2400;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
`;

const CloseButton = styled.button`
  position: fixed;
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
const LabImage = styled.img`
  width: 4rem;
  height: 4rem;
  margin-bottom: 0.5rem;
`;

const LabInfo = styled.div`
  color: white;
  text-align: center;
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
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 className="text-lg font-bold text-white mb-4">Select a Lab</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(labs).map((lab) => {
            const levelRequirement = lab[1].levelRequirement;
            let locked = false;
            const requiredProduct = products.find((u) => u.name === lab[0]);
            if (!requiredProduct) {
              locked = true;
            } else {
              locked = requiredProduct.level < levelRequirement;
            }
            return (
              <LabItem key={lab[0]}>
                <LabImage src={lab[1].image} alt={lab[0]} />
                <LabInfo>Type: {lab[0]}</LabInfo>
                <LabInfo>Capacity: {lab[1].baseCapacity}</LabInfo>
                <LabInfo>Production: {lab[1].baseProduction}</LabInfo>
                <LabInfo>Price: ${lab[1].labPrice}</LabInfo>
                {locked ? (
                  <LockedButton
                    disabled = {locked}
                  >
                    Locked
                  </LockedButton>
                ) : (
                  <LabButton
                  onClick={() => buyAndClose(lab[0] as EProduct, plotId)}
                  >
                    Buy
                  </LabButton>
                )}
              </LabItem>
            )}
          )}
        </div>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
