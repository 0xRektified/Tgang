import React, { useState } from "react";
import { LuPackagePlus } from "react-icons/lu";
import { FaShippingFast } from "react-icons/fa";
import { TouchPoint } from "../utils/types";
import { IUserInfo, IUserShipping } from "../interfaces/user.interface";
import { CardRequirement } from "../styled/cardStyled";
import {
  EShippingMethod,
  IShippingMethod,
} from "../interfaces/shipping.interface";
import BuyCard from "../BuyCard";
import { convertSecondsToReadableTime } from "../utils/formater";
import { IRequirement, RequirementType } from "../interfaces/upgrade.interface";

interface RenderShippingProps {
  userInfo: IUserInfo;
  tab: string;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  buyShippingMethod: (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => Promise<void>;
  upgradeShippingCapacity: (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => Promise<void>;
  upgradeShippingShippingTime: (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => Promise<void>;
}

export const RenderShipping: React.FC<RenderShippingProps> = ({
  userInfo,
  tab,
  shippingMethods,
  setTouchPoints,
  setUserInfo,
  setShowBalanceErrorToast,
  buyShippingMethod,
  upgradeShippingCapacity,
  upgradeShippingShippingTime,
}) => {
  const render = (
    shipping: IUserShipping | undefined,
    upgrade: IShippingMethod,
    key: EShippingMethod,
    capacityLevel: string,
    shippingTimeLevel: string,
    price?: number,
    locked?: boolean,
    requirement?: IRequirement | null,
  ) => {
    let bought = false;
    if (shipping) {
      bought = true;
    }

    const upgradeOptions = shipping
      ? [
          {
            label: "Capacity +",
            valueDiff: (
              shipping.upgradeCapacity! - shipping.capacity!
            ).toString(),
            price: shipping.upgradeCapacityPrice || 0,
            icon: <LuPackagePlus />,
            onClick: async () => {
              await upgradeShippingCapacity(shipping.method, setUserInfo);
            },
          },
          {
            label: "Shipping Time -",
            valueDiff: convertSecondsToReadableTime(
              Math.abs(shipping.upgradeShippingTime! - shipping.shippingTime!),
            ).toString(),
            price: shipping.upgradeShippingTimePrice || 0,
            icon: <FaShippingFast />,
            onClick: async () => {
              await upgradeShippingShippingTime(shipping.method, setUserInfo);
            },
          },
        ]
      : [];

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
            ? {
                name: key.toString(),
                level: requirement.level,
                requirement: requirement.requirement,
              }
            : null,
        }}
        locked={locked || false}
        onBuyClick={async (params, setUserInfo) => {
          await buyShippingMethod(upgrade.title, setUserInfo);
        }}
        upgradeOption={bought}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        setTouchPoints={setTouchPoints}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
        category="shipping"
        upgradeKey={key}
        upgradeOptions={upgradeOptions}
      />
    );
  };

  const renderUpgradeCategory = (
    categoryTitle: string,
    shippingMethods: Record<EShippingMethod, IShippingMethod>,
    userShipping: IUserShipping[],
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize p-4">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(shippingMethods ?? {}).map(([key, method]) => {
          const userUpgrade: IUserShipping | undefined = userShipping.find(
            (u) => u.method === key,
          );
          let price = method.basePrice;
          let capacityLevel: string;
          let shippingTimeLevel: string;
          let requirement: IRequirement | null = null;
          if (userUpgrade) {
            capacityLevel = `${userUpgrade.capacity} to ${userUpgrade.upgradeCapacity}`;
            shippingTimeLevel = `
            ${convertSecondsToReadableTime(userUpgrade.shippingTime)} 
            to
            ${convertSecondsToReadableTime(userUpgrade.upgradeShippingTime)} `;
          } else {
            capacityLevel = `${method.baseCapacity}`;
            shippingTimeLevel = `${convertSecondsToReadableTime(
              method.baseShippingTime,
            )}`;
          }

          if (userUpgrade?.requirements) {
            requirement = userUpgrade.requirements[0];
          } else if (method.requirements) {
            requirement = method.requirements[0];
          }

          let locked = false;
          if (requirement) {
            const referredUsers = userInfo.referredUsers.length;
            locked = referredUsers < requirement.level;
          }

          return render(
            userUpgrade,
            method,
            key as EShippingMethod,
            capacityLevel,
            shippingTimeLevel,
            price,
            locked,
            requirement,
          );
        })}
      </div>
    </div>
  );

  if (!shippingMethods) return <></>;

  return (
    <div className="space-y-4 scrollable-content">
      {tab === "shipping" &&
        renderUpgradeCategory(
          "Shipping Methods",
          shippingMethods,
          userInfo.shipping,
        )}
    </div>
  );
};

export default RenderShipping;
