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
import { TouchPoint } from "../utils/types";

interface LabModalProps {
  labs: Record<EProduct, ILab>;
  userInfo: IUserInfo;
  plotId: number;
  products: Product[];
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  buyLab: (
    lab: IBuyLab,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
}

const LabModal: React.FC<LabModalProps> = ({
  labs,
  userInfo,
  plotId,
  products,
  onClose,
  setUserInfo,
  setTouchPoints,
  setShowBalanceErrorToast,
  buyLab,
}) => {
  const handleBuyClick = async (
    labProduct: EProduct,
    plotId: number,
    price: number,
    touch: React.Touch
  ) => {
    if (userInfo.cashAmount >= price) {
      await buyLab(
        {
          labProduct,
          plotId,
        },
        setUserInfo
      );

      const newTouchPoint: TouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: -price,
      };

      setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
      setTimeout(() => {
        setTouchPoints((prevTouchPoints) =>
          prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
        );
      }, 3000);
      onClose();
    } else {
      setShowBalanceErrorToast(true);
    }
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
            const noop = () => {};

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
                onBuyClick={(e) =>
                  handleBuyClick(labKey as EProduct, plotId, lab.labPrice, e)
                }
                upgradeOption={false}
                renderRequirements={renderRequirements}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                setTouchPoints={setTouchPoints}
                setShowBalanceErrorToast={setShowBalanceErrorToast}
                upgradeOptions={[]}
              />
            );
          })}
        </LabGrid>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
