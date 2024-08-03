import React, { useEffect, useState } from "react";
import {
  CardContainer,
  CardHeader,
  CardImage,
  CardDetails,
  CardInfoColumn,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
  NeonButton,
  CardInfoColumnText,
  CardCost,
} from "./styled/cardStyled";
import BuyConfirmationModal from "./BuyConfirmationModal";
import { IUserInfo } from "./interfaces/user.interface";
import { UpgradeConfirmationModal } from "./UpgradeConfirmationModal";
import { TouchPoint } from "./utils/types";

interface BuyCardProps {
  item: {
    image: string;
    title: string;
    cost: number;
    level?: number | undefined;
    upgradeValue?: string | undefined;
    shippingTimeLevel?: string | undefined;
    capacityLevel?: string | undefined;
    productionLevel?: number | undefined;
    labCapacity?: number | undefined;
    labProduction?: number | undefined;
    description: string;
    requirements?: { name: string; level: number } | null;
  };
  locked: boolean;
  onBuyClick: (
    params: any,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
  upgradeOption: boolean;
  renderRequirements: (
    requirements?: { name: string; level: number } | null
  ) => React.ReactNode;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  category?: string;
  upgradeKey?: string; // EProduct | EDealerUpgrade | EShippingMethod
  upgradeOptions?: {
    label: string;
    valueDiff: string;
    price: number;
    icon: React.ReactElement;
    onClick: () => void;
  }[];
}

const BuyCard: React.FC<BuyCardProps> = ({
  item,
  locked,
  onBuyClick,
  upgradeOption,
  renderRequirements,
  userInfo,
  setUserInfo,
  setTouchPoints,
  setShowBalanceErrorToast,
  category,
  upgradeKey,
  upgradeOptions = [],
}) => {
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [touchEvent, setTouchEvent] =
    useState<React.TouchEvent<HTMLButtonElement> | null>(null);

  const {
    image,
    title,
    cost,
    level,
    upgradeValue,
    shippingTimeLevel,
    capacityLevel,
    productionLevel,
    labCapacity,
    labProduction,
    description,
    requirements,
  } = item;

  const safeRequirements = requirements
    ? { ...requirements, name: requirements.name || "Unknown" }
    : null;

  const handleCardClick = async (
    price: number,
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    const touch = e.touches[0];
    if (userInfo.cashAmount >= price) {
      await onBuyClick(
        { category, upgrade: upgradeKey, upgradePrice: price },
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
    } else {
      setShowBalanceErrorToast(true);
    }
  };

  const handleConfirmBuy = (e: React.TouchEvent<HTMLButtonElement>) => {
    setShowBuyConfirmation(false);
    if (touchEvent) {
      handleCardClick(item.cost, touchEvent);
    }
  };

  const handleBuyClick = (e: React.TouchEvent<HTMLButtonElement>) => {
    setTouchEvent(e);
    setShowBuyConfirmation(true);
  };

  const handleUpgradeClick = (e: React.TouchEvent<HTMLButtonElement>) => {
    setTouchEvent(e);
    setShowUpgradeModal(true);
  };

  return (
    <>
      <CardContainer>
        <CardHeader>
          <CardImage src={image} alt={title} />
          <CardDetails>
            <CardInfoColumn>
              <CardTitle>{title}</CardTitle>
              <>
                {level ? (
                  <CardInfoColumnText>Level: {level}</CardInfoColumnText>
                ) : (
                  ""
                )}
                {upgradeValue && (
                  <CardInfoColumnText>{upgradeValue}</CardInfoColumnText>
                )}
                {shippingTimeLevel && (
                  <CardInfoColumnText>
                    Shipping Time: {shippingTimeLevel}
                  </CardInfoColumnText>
                )}
                {capacityLevel && (
                  <CardInfoColumnText>
                    Capacity: {capacityLevel}
                  </CardInfoColumnText>
                )}
                {labCapacity && (
                  <CardInfoColumnText>
                    Capacity: {labCapacity}
                  </CardInfoColumnText>
                )}
                {productionLevel && (
                  <CardInfoColumnText>
                    Production level: {productionLevel}
                  </CardInfoColumnText>
                )}
                {labProduction && (
                  <CardInfoColumnText>
                    Production: {labProduction}
                  </CardInfoColumnText>
                )}
                <CardInfoColumnText>
                  Cost: <CardCost>{cost}$</CardCost>
                </CardInfoColumnText>
              </>
            </CardInfoColumn>
            <CardInfoColumn>
              {locked ? (
                <Button disabled>Locked</Button>
              ) : (
                <>
                  {upgradeOption ? (
                    <NeonButton onTouchStart={handleUpgradeClick}>
                      Upgrade
                    </NeonButton>
                  ) : (
                    <NeonButton onTouchStart={handleBuyClick}>Buy</NeonButton>
                  )}
                </>
              )}
            </CardInfoColumn>
          </CardDetails>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
          {locked && renderRequirements(safeRequirements)}
        </CardContent>
      </CardContainer>
      {showBuyConfirmation && (
        <BuyConfirmationModal
          itemTitle={title}
          itemCost={cost}
          onConfirm={handleConfirmBuy}
          onClose={() => setShowBuyConfirmation(false)}
        />
      )}
      {showUpgradeModal && (
        <UpgradeConfirmationModal
          title={`Upgrade ${title}`}
          options={upgradeOptions}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};

export default BuyCard;
