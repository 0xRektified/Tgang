import React, { useState } from "react";
import WebApp from "@twa-dev/sdk";
import {
  CardContainer,
  CardHeader,
  CardImageContainer,
  CardImage,
  CardDetails,
  CardInfoGrid,
  InfoItemContainer,
  InfoLabel,
  InfoValue,
  SmallButton,
  SmallNeonButton,
  CardTitle,
  CardDescription,
  RequirementText,
  CardFooter,
  CardCost,
  CardButtonContainer,
  CardRightColumn,
  CardLeftColumn,
} from "./styled/cardStyled";
import BuyConfirmationModal from "./BuyConfirmationModal";
import { IUserInfo } from "./interfaces/user.interface";
import { UpgradeConfirmationModal } from "./UpgradeConfirmationModal";
import { TouchPoint } from "./utils/types";
import { formatPrice } from "./utils/formater";
import { RequirementType } from "./interfaces/upgrade.interface";
import styled from "styled-components";

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
    requirements?: {
      name?: string;
      level: number;
      requirement: RequirementType;
    } | null;
  };
  locked: boolean;
  onBuyClick: (
    params: any,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => Promise<void>;
  upgradeOption: boolean;
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

const DummyRequirement = styled.div`
  height: 24px; // Adjust this value to match the height of the RequirementText
`;

const BuyCard: React.FC<BuyCardProps> = ({
  item,
  locked,
  onBuyClick,
  upgradeOption,
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

  const renderRequirements = (
    requirements?: {
      name?: string;
      level: number;
      requirement: RequirementType;
    } | null,
  ) => {
    if (!requirements) return null;

    const requirementText =
      requirements.requirement === "referredUsers"
        ? `Requires ${requirements.level || 0} Referred Users`
        : `Requires ${requirements.name || "Unknown"} Level ${
            requirements.level || 0
          }`;

    return <RequirementText>{requirementText}</RequirementText>;
  };

  const handleCardClick = async (price: number) => {
    WebApp.HapticFeedback.impactOccurred("heavy");

    if (userInfo.cashAmount >= price) {
      await onBuyClick(
        { category, upgrade: upgradeKey, upgradePrice: price },
        setUserInfo,
      );

      const newTouchPoint: TouchPoint = {
        id: Date.now(),
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        amountEarned: -price,
      };

      setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
      setTimeout(() => {
        setTouchPoints((prevTouchPoints) =>
          prevTouchPoints.filter((point) => point.id !== newTouchPoint.id),
        );
      }, 3000);
    } else {
      setShowBalanceErrorToast(true);
    }
  };

  const handleConfirmBuy = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setShowBuyConfirmation(false);
    handleCardClick(item.cost);
  };

  const handleBuyClick = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setShowBuyConfirmation(true);
  };

  const handleUpgradeClick = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    setShowUpgradeModal(true);
  };

  return (
    <>
      <CardContainer>
        <CardLeftColumn>
          <CardImageContainer>
            <CardImage src={image} alt={title} loading="lazy" />
          </CardImageContainer>
          <CardButtonContainer>
            {locked ? (
              <SmallButton disabled>Locked</SmallButton>
            ) : (
              <>
                {upgradeOption ? (
                  <SmallNeonButton onClick={handleUpgradeClick}>
                    Upgrade
                  </SmallNeonButton>
                ) : (
                  <SmallNeonButton onClick={handleBuyClick}>
                    Buy
                  </SmallNeonButton>
                )}
              </>
            )}
          </CardButtonContainer>
        </CardLeftColumn>
        <CardRightColumn>
          <CardDetails>
            <CardTitle>{title}</CardTitle>
            <CardInfoGrid>
              {level ? <InfoItem label="Level" value={level} /> : null}
              {upgradeValue && (
                <InfoItem label="Upgrade" value={upgradeValue} />
              )}
              {shippingTimeLevel && (
                <InfoItem label="Shipping Time" value={shippingTimeLevel} />
              )}
              {capacityLevel && (
                <InfoItem label="Capacity" value={capacityLevel} />
              )}
              {labCapacity && <InfoItem label="Capacity" value={labCapacity} />}
              {productionLevel && (
                <InfoItem label="Production Level" value={productionLevel} />
              )}
              {labProduction && (
                <InfoItem label="Production" value={labProduction} />
              )}
            </CardInfoGrid>
            <CardDescription>{description}</CardDescription>
            {upgradeOption ? (
              <></>
            ) : (
              <CardCost>
                <InfoItem
                  label="Cost"
                  value={formatPrice(cost, false)}
                  isCost
                />
              </CardCost>
            )}
            {locked ? renderRequirements(safeRequirements) : <></>}
          </CardDetails>
        </CardRightColumn>
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

const InfoItem: React.FC<{
  label: string;
  value: string | number;
  isCost?: boolean;
}> = ({ label, value, isCost }) => (
  <InfoItemContainer>
    {label && label != "Upgrade" ? <InfoLabel>{label}:</InfoLabel> : null}
    <InfoValue isCost={isCost}>{value}</InfoValue>
  </InfoItemContainer>
);

export default BuyCard;
