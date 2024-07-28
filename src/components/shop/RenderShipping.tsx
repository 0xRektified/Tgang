import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";

import { IUserInfo, IUserShipping } from "../interfaces/user.interface";
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
import {
  EShippingMethod,
  IShippingMethod,
  Requirement,
} from "../interfaces/shipping.interface";
import { useBuyShippingMethod } from "../../hooks/useBuyShippingMethod";

interface RenderShippingProps {
  userInfo: IUserInfo;
  tab: string;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPurchasedShippingModal: (shipping: IUserShipping) => void;
}

export const RenderShipping: React.FC<RenderShippingProps> = ({
  userInfo,
  tab,
  shippingMethods,
  setTouchPoints,
  setUserInfo,
  setShowBalanceErrorToast,
  handleOpenPurchasedShippingModal,
}) => {
  const { buyShippingMethod } = useBuyShippingMethod();

  console.log("shippingMethods", shippingMethods);

  const handleBuyShippingMethod = async (
    method: EShippingMethod,
    price: number,
    touch: React.Touch
  ) => {
    if (userInfo.cashAmount >= price) {
      await buyShippingMethod(method, setUserInfo);

      const newTouchPoint = {
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
      WebApp.HapticFeedback.impactOccurred("heavy");
    } else {
      setShowBalanceErrorToast(true);
    }
  };

  const handleCardClick = (
    method: EShippingMethod,
    price: number,
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    const touch = e.touches[0];

    handleBuyShippingMethod(method, price, touch);
  };

  const renderRequirements = (requirement?: Requirement | null) => {
    if (!requirement) return <></>;

    return (
      <div>
        <CardRequirement>
          Requires {requirement.referredUsers} User Invites
        </CardRequirement>
      </div>
    );
  };

  const renderUpgrade = (
    shiping: IUserShipping | undefined,
    upgrade: IShippingMethod,
    key: EShippingMethod,
    capacityLevel: number,
    shippingTimeLevel: number,
    price?: number,
    locked?: boolean,
    requirement?: Requirement | null
  ) => {
    let bought = false;
    if (capacityLevel > 0 || shippingTimeLevel > 0) {
      bought = true;
    }

    return (
      <CardContainer key={upgrade.title} locked={locked}>
        <CardHeader>
          <CardImage src={upgrade.image} alt={upgrade.title} />
          <CardDetails>
            <CardInfoColumn>
              <CardTitle>{upgrade.title}</CardTitle>
              {bought ? (
                <>
                  <p style={{ fontSize: "0.7rem" }}>Capacity Level: {capacityLevel}</p>
                  <p style={{ fontSize: "0.7rem" }}>Shipping Time Level: {shippingTimeLevel}</p>
                </>
              ) : (
                <>
                  <p>Cost: ${price}</p>
                </>
              )}
            </CardInfoColumn>
            <CardInfoColumn>
              {locked ? (
                <Button>Locked</Button>
              ) : (
                // TODO: show upgrade modal if upgrade is already bought
                <>
                {bought ? (
                  <NeonButton
                    onClick={() => handleOpenPurchasedShippingModal(shiping!)}
                  >
                    Upgrade
                  </NeonButton>
                ) : (
                  <NeonButton
                    onTouchStart={(e) => handleCardClick(key, price as number, e)}
                  >
                    Buy
                  </NeonButton>
                  )}
                </>
              )}
            </CardInfoColumn>
          </CardDetails>
        </CardHeader>
        <CardContent>
          <CardDescription>{upgrade.description}</CardDescription>
          {locked ? renderRequirements(requirement) : <></>}
        </CardContent>
      </CardContainer>
    );
  };

  const renderUpgradeCategory = (
    categoryTitle: string,
    shippingMethods: Record<EShippingMethod, IShippingMethod>,
    userShipping: IUserShipping[]
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(shippingMethods ?? {}).map(([key, method]) => {
          const userUpgrade = userShipping.find((u) => u.method === key);
          let price;
          let capacityLevel = 0;
          let capacityPrice;
          let shippingTimeLevel = 0;
          let shippingTimePrice;
          let requirement: Requirement | null = null;

          if (!userUpgrade) {
            price = method.basePrice;
            requirement = method.requirement;
          } else {
            capacityLevel = userUpgrade.capacityLevel;
            capacityPrice = userUpgrade.upgradeCapacityPrice;
            shippingTimeLevel = userUpgrade.shippingTimeLevel;
            shippingTimePrice = userUpgrade.upgradeShippingTimePrice;
            requirement = userUpgrade.requirement;
          }

          let locked = false;
          if (requirement) {
            const referredUsers = userInfo.referredUsers.length;
            locked = referredUsers < requirement.referredUsers;
          }

          return renderUpgrade(
            userUpgrade,
            method,
            key as EShippingMethod,
            capacityLevel,
            shippingTimeLevel,
            price,
            locked,
            requirement
          );
        })}
      </div>
    </div>
  );

  if (!shippingMethods) return <></>;

  const renderAllShippingCategories = () => (
    <>{renderUpgradeCategory("Methods", shippingMethods, userInfo.shipping)}</>
  );

  return (
    <div className="space-y-4">
      {tab === "shipping" && renderAllShippingCategories()}
    </div>
  );
};
