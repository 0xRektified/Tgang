import React from "react";
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
} from "./styled/cardStyled";

interface BuyCardProps {
  item: {
    image: string;
    title: string;
    cost: number;
    level?: number | undefined;
    shippingTimeLevel?: number | undefined;
    capacityLevel?: number | undefined;
    productionLevel?: number | undefined;
    labCapacity?: number | undefined;
    labProduction?: number | undefined;
    description: string;
    requirements?: { name: string; level: number } | null;
  };
  locked: boolean;
  onBuyClick: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onUpgradeClick: (e: React.TouchEvent<HTMLButtonElement>) => void;
  bought: boolean;
  renderRequirements: (
    requirements?: { name: string; level: number } | null
  ) => React.ReactNode;
}

const BuyCard: React.FC<BuyCardProps> = ({
  item,
  locked,
  onBuyClick,
  onUpgradeClick,
  bought,
  renderRequirements,
}) => {
  const {
    image,
    title,
    cost,
    level,
    shippingTimeLevel,
    capacityLevel,
    productionLevel,
    labCapacity,
    labProduction,
    description,
    requirements,
  } = item;

  // Ensure that name is a string
  const safeRequirements = requirements
    ? { ...requirements, name: requirements.name || "Unknown" }
    : null;

  return (
    <CardContainer>
      <CardHeader>
        <CardImage src={image} alt={title} />
        <CardDetails>
          <CardInfoColumn>
            <CardTitle>{title}</CardTitle>
            <>
              {shippingTimeLevel && (
                <CardInfoColumnText>Level: {level}</CardInfoColumnText>
              )}
              {shippingTimeLevel && (
                <CardInfoColumnText>
                  Shipping Time Level: {shippingTimeLevel}
                </CardInfoColumnText>
              )}
              {capacityLevel && (
                <CardInfoColumnText>
                  Capacity Level: {capacityLevel}
                </CardInfoColumnText>
              )}
              {labCapacity && (
                <CardInfoColumnText>Capacity: {labCapacity}</CardInfoColumnText>
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
              <CardInfoColumnText>Cost: ${cost}</CardInfoColumnText>
            </>
          </CardInfoColumn>
          <CardInfoColumn>
            {locked ? (
              <Button disabled>Locked</Button>
            ) : (
              <>
                {bought ? (
                  <NeonButton onTouchStart={onUpgradeClick}>Upgrade</NeonButton>
                ) : (
                  <NeonButton onTouchStart={onBuyClick}>Buy</NeonButton>
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
  );
};

export default BuyCard;
