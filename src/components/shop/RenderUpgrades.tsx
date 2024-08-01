import React from "react";
import { TouchPoint } from "./utils/types";
import {
  DealerUpgrade,
  EDealerUpgrade,
  EUpgradeCategory,
  IRequirement,
  IUpgrade,
  ProductUpgrade,
} from "../interfaces/upgrade.interface";
import { IUserInfo } from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";
import BuyCard from "../BuyCard";
import { CardRequirement } from "../styled/cardStyled";

interface RenderUpgradesProps {
  userInfo: IUserInfo;
  tab: string;
  upgradesData: IUpgrade | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
  buyUpgrade: (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
    },
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  userInfo,
  tab,
  upgradesData,
  setTouchPoints,
  setUserInfo,
  setShowBalanceErrorToast,
  buyUpgrade,
}) => {
  const handleBuyUpgrade = async (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
      upgradePrice: number;
    },
    touch: React.Touch
  ) => {
    const cost = params.upgradePrice;
    if (userInfo.cashAmount >= cost) {
      await buyUpgrade(params, setUserInfo);

      const newTouchPoint: TouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: -cost,
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
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
      upgradePrice: number;
    },
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    console.log(`Render Upgrade handleCardClick`);
    const touch = e.touches[0];
    handleBuyUpgrade(params, touch);
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
    upgrade: ProductUpgrade | DealerUpgrade,
    key: EProduct | EDealerUpgrade,
    category: EUpgradeCategory,
    price: number,
    level: number,
    upgradeDiff?: string,
    locked?: boolean
  ) => {
    return (
      <BuyCard
        key={key}
        item={{
          image: upgrade.image,
          title: upgrade.title,
          cost: price,
          level: level,
          description: upgrade.description,
          requirements: upgrade.requirements
            ? { name: key as string, level: level }
            : null,
        }}
        locked={locked || false}
        onBuyClick={(e) =>
          handleCardClick(
            {
              category,
              upgrade: key,
              upgradePrice: price,
            },
            e
          )
        }
        onUpgradeClick={(e) =>
          handleCardClick(
            {
              category,
              upgrade: key,
              upgradePrice: price,
            },
            e
          )
        }
        bought={!locked}
        renderRequirements={renderRequirements}
      />
    );
  };

  const renderUpgradeCategory = (
    categoryTitle: string,
    upgrades: Record<string, ProductUpgrade | DealerUpgrade> | undefined,
    category: EUpgradeCategory,
    userInfo: IUserInfo
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
          const userUpgrades = userInfo.dealerUpgrades;
          const userUpgrade = userUpgrades.find((u) => u.product === key);
          const price = userUpgrade?.upgradePrice || upgrade.basePrice;
          const level = userUpgrade?.level || 0;
          const upgradeRequirements = upgrade.requirements as IRequirement[];
          let locked = false;
          if (upgradeRequirements) {
            locked = upgradeRequirements.some((req) => {
              const requiredProduct = userInfo.products.find(
                (u) => u.name === req.product
              );
              return !requiredProduct || requiredProduct.level < req.level;
            });
          }
          return renderUpgrade(
            upgrade,
            key as EProduct | EDealerUpgrade,
            category,
            price,
            level,
            "",
            locked
          );
        })}
      </div>
    </div>
  );

  const renderProductCategory = (
    categoryTitle: string,
    upgrades: Record<string, ProductUpgrade | DealerUpgrade> | undefined,
    category: EUpgradeCategory,
    userInfo: IUserInfo
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
          const userUpgrades = userInfo.products;
          const userUpgrade = userUpgrades.find((u) => u.name === key);
          const price = userUpgrade?.upgradePrice || upgrade.basePrice;
          const level = userUpgrade?.level || 0;
          const upgradeRequirements = upgrade.requirements;
          let locked = false;
          if (upgradeRequirements) {
            locked = upgradeRequirements.some((req) => {
              const requiredProduct = userInfo.products.find(
                (u) => u.name === req.product
              );
              return !requiredProduct || requiredProduct.level < req.level;
            });
          }
          return renderUpgrade(
            upgrade,
            key as EProduct | EDealerUpgrade,
            category,
            price,
            level,
            "",
            locked
          );
        })}
      </div>
    </div>
  );

  if (!upgradesData) return <></>;

  const renderAllDealerCategories = () => (
    <>
      {renderUpgradeCategory(
        "Customers",
        upgradesData?.dealer ?? {},
        EUpgradeCategory.DEALER,
        userInfo
      )}
      {renderProductCategory(
        "Products",
        upgradesData?.product ?? {},
        EUpgradeCategory.PRODUCT,
        userInfo
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {tab === "dealer" && renderAllDealerCategories()}
    </div>
  );
};

export default RenderUpgrades;
