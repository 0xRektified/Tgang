import React from "react";
import "tailwindcss/tailwind.css";
import { IBuyLab, ILab } from "../interfaces/lab.interface";
import { EProduct } from "../interfaces/product.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import BuyCard from "../BuyCard";
import {
  ModalBackground,
  ModalContent,
  LabTitle,
  LabGrid,
  CloseButton,
} from "../styled/renderUpgradesStyled";
import { CardRequirement } from "../styled/cardStyled";

interface LabModalProps {
  labs: Record<EProduct, ILab>;
  plotId: number;
  products: Product[];
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  buyLab: (
    lab: IBuyLab,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
}

const LabModal: React.FC<LabModalProps> = ({
  labs,
  plotId,
  products,
  onClose,
  setUserInfo,
  buyLab,
}) => {
  const buyAndClose = (
    labProduct: EProduct,
    plotId: number,
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    buyLab(
      {
        labProduct,
        plotId,
      },
      setUserInfo
    );
    onClose();
  };

  const renderRequirements = (
    requirements?: { name: string; level: number } | null
  ) => (
    <CardRequirement>
      Requires {requirements?.name || "Unknown"} Level{" "}
      {requirements?.level || 0}
    </CardRequirement>
  );

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
              <BuyCard
                key={labKey}
                item={{
                  image: lab.image,
                  title: labKey,
                  cost: lab.labPrice,
                  productionLevel: lab.productionLevel,
                  labCapacity: lab.baseCapacity,
                  labProduction: lab.baseProduction,
                  description: lab.description,
                  requirements: {
                    name: requiredProduct?.name || "Unknown",
                    level: levelRequirement,
                  },
                }}
                locked={locked}
                onBuyClick={(e) => buyAndClose(labKey as EProduct, plotId, e)}
                onUpgradeClick={(e) =>
                  buyAndClose(labKey as EProduct, plotId, e)
                }
                bought={!locked}
                renderRequirements={renderRequirements}
              />
            );
          })}
        </LabGrid>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
