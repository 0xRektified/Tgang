import React from "react";
import { TouchPoint } from "./utils/types";

import { IUserInfo, IUserShipping } from "../interfaces/user.interface";
import { CardRequirement } from "../styled/cardStyled";

import {
  EShippingMethod,
  IShippingMethod,
  Requirement,
} from "../interfaces/shipping.interface";
import BuyCard from "../BuyCard";

interface RenderShippingProps {
  userInfo: IUserInfo;
  tab: string;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPurchasedShippingModal: (shipping: IUserShipping) => void;
  buyShippingMethod: (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
}

export const RenderShipping: React.FC<RenderShippingProps> = ({
  userInfo,
  tab,
  shippingMethods,
  setTouchPoints,
  setUserInfo,
  setShowBalanceErrorToast,
  handleOpenPurchasedShippingModal,
  buyShippingMethod,
}) => {
  console.log("shippingMethods", shippingMethods);

  const handleBuyShippingMethod = async (
    method: EShippingMethod,
    price: number,
    touch: React.Touch
  ) => {
    if (userInfo.cashAmount >= price) {
      await buyShippingMethod(method, setUserInfo);

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

  const handleCardClick = (
    method: EShippingMethod,
    price: number,
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    console.log(`Render Shipping handleCardClick`);

    const touch = e.touches[0];
    handleBuyShippingMethod(method, price, touch);
  };

  const renderRequirements = (
    requirements?: { name: string; level: number } | null
  ) => {
    if (!requirements) return <></>;

    return (
      <div>
        <CardRequirement>
          Requires {requirements.name} Level {requirements.level}
        </CardRequirement>
      </div>
    );
  };

  const renderUpgrade = (
    shipping: IUserShipping | undefined,
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
      <BuyCard
        key={key}
        item={{
          image: upgrade.image,
          title: upgrade.title,
          cost: price || 0,
          capacityLevel: capacityLevel,
          shippingTimeLevel: shippingTimeLevel,
          description: upgrade.description,
          requirements: requirement
            ? { name: key.toString(), level: requirement.referredUsers }
            : null,
        }}
        locked={locked || false}
        onBuyClick={(e) => handleCardClick(key, price || 0, e)}
        onUpgradeClick={(e) => handleOpenPurchasedShippingModal(shipping!)}
        bought={bought}
        renderRequirements={renderRequirements}
      />
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
          let shippingTimeLevel = 0;
          let requirement: Requirement | null = null;

          if (!userUpgrade) {
            price = method.basePrice;
            requirement = method.requirement;
          } else {
            capacityLevel = userUpgrade.capacityLevel;
            shippingTimeLevel = userUpgrade.shippingTimeLevel;
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
