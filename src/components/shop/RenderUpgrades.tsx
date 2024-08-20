import React from "react";
import {
  DealerUpgrade,
  EDealerUpgrade,
  EUpgradeCategory,
  IRequirement,
  IUpgrade,
  ProductUpgrade,
} from "../interfaces/upgrade.interface";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";
import BuyCard from "../BuyCard";
import { CardRequirement } from "../styled/cardStyled";
import { TouchPoint } from "../utils/types";

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

  const render = (
    upgrade: ProductUpgrade | DealerUpgrade,
    key: EProduct | EDealerUpgrade,
    category: EUpgradeCategory,
    price: number,
    level: number,
    upgradeEffect?: string,
    locked?: boolean
  ) => {
    const noop = () => {};

    return (
      <BuyCard
        key={key}
        item={{
          image: upgrade.image,
          title: upgrade.title,
          cost: price,
          level: level,
          upgradeValue: upgradeEffect,
          description: upgrade.description,
          requirements: upgrade.requirements
            ? {
                name: upgrade.requirements[0].product,
                level: upgrade.requirements[0].level,
              }
            : null,
        }}
        locked={locked || false}
        onBuyClick={buyUpgrade}
        upgradeOption={false}
        renderRequirements={renderRequirements}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        setTouchPoints={setTouchPoints}
        setShowBalanceErrorToast={setShowBalanceErrorToast}
        category={category}
        upgradeKey={key}
        upgradeOptions={[]}
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
          const productUpgrade = upgrade as DealerUpgrade;
          const userUpgrades = userInfo.dealerUpgrades;
          const userUpgrade = userUpgrades.find((u) => u.upgrade === key);
          const price: number =
            userUpgrade?.upgradePrice || productUpgrade.basePrice;
          const level = userUpgrade?.level || 0;
          const upgradeRequirements =
            productUpgrade.requirements as IRequirement[];
          let locked = false;
          if (upgradeRequirements) {
            locked = upgradeRequirements.some((req) => {
              const requiredProduct = userInfo.products.find(
                (u) => u.name === req.product
              );
              return !requiredProduct || requiredProduct.level < req.level;
            });
          }

          const upgradeDiff =
            userUpgrade?.upgradeAmount! - userUpgrade?.amount!;
          let upgradeEffect: string | undefined;
          switch (key) {
            case EDealerUpgrade.SOCIAL_MEDIA_CAMPAGIN:
            case EDealerUpgrade.STREET_PROMOTION_TEAM:
            case EDealerUpgrade.CLUB_PARTNERSHIP:
              upgradeEffect = `Adds ${
                upgradeDiff || productUpgrade.amountMultiplier
              } customers`;
              break;
            case EDealerUpgrade.COMBO_PACKS:
            case EDealerUpgrade.HIGH_END_PACKAGING:
            case EDealerUpgrade.PARTY_PACKS:
            case EDealerUpgrade.HIGH_DOSE_PACKAGES:
            case EDealerUpgrade.FESTIVAL_BLOTTERS:
            case EDealerUpgrade.BULK_BAGS:
              upgradeEffect = `Customers buy ${
                upgradeDiff || productUpgrade.amountMultiplier
              } more product`;
              break;
          }

          return render(
            upgrade,
            key as EProduct | EDealerUpgrade,
            category,
            price,
            level,
            upgradeEffect,
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
          const productUpgrade = upgrade as ProductUpgrade;
          const userUpgrades = userInfo.products;
          const userUpgrade = userUpgrades.find((u: Product) => u.name === key);
          const price = userUpgrade?.upgradePrice || productUpgrade.basePrice;
          const level = userUpgrade?.level || 0;
          const upgradeRequirements = productUpgrade.requirements;
          let locked = false;
          if (upgradeRequirements) {
            locked = upgradeRequirements.some((req) => {
              const requiredProduct = userInfo.products.find(
                (u) => u.name === req.product
              );
              return !requiredProduct || requiredProduct.level < req.level;
            });
          }

          const upgradeEffect = userUpgrade?.upgradeMarketDiscount
            ? `Discount from ${userUpgrade?.marketDiscount.toFixed(
                2
              )}% to ${userUpgrade?.upgradeMarketDiscount.toFixed(2)}%`
            : `Unlock a ${productUpgrade.baseDiscount}% discount`;
          return render(
            productUpgrade,
            key as EProduct | EDealerUpgrade,
            category,
            price,
            level,
            upgradeEffect,
            locked
          );
        })}
      </div>
    </div>
  );

  if (!upgradesData) return <></>;

  const renderAllDealerCategories = () => (
    <>
      {renderProductCategory(
        "Products",
        upgradesData?.product ?? {},
        EUpgradeCategory.PRODUCT,
        userInfo
      )}
      {renderUpgradeCategory(
        "Customers",
        upgradesData?.dealer ?? {},
        EUpgradeCategory.DEALER,
        userInfo
      )}
    </>
  );

  return (
    <div className="space-y-4 scrollable-content">
      {tab === "dealer" && renderAllDealerCategories()}
    </div>
  );
};

export default RenderUpgrades;
