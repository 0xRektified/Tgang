import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import {
  DealerUpgrade,
  EDealerUpgrade,
  EUpgradeCategory,
  IUpgrade,
  ProductUpgrade,
} from "../interfaces/upgrade.interface";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import {
  IUserInfo,
  Product,
  UserDealerUpgrade,
} from "../interfaces/user.interface";
import { EProduct } from "../interfaces/product.interface";
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
import { UserInfo } from "os";

interface RenderUpgradesProps {
  userInfo: IUserInfo;
  tab: string;
  upgradesData: IUpgrade | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
  setShowBalanceErrorToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  userInfo,
  tab,
  upgradesData,
  setTouchPoints,
  setUserInfo,
  setShowBalanceErrorToast,
}) => {
  const { buyUpgrade } = useBuyUpgrades();

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

      const newTouchPoint = {
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
      WebApp.HapticFeedback.impactOccurred("heavy");
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
    const touch = e.touches[0];

    handleBuyUpgrade(params, touch);
  };

  const renderRequirements = (
    requirements: { product: string; level: number }[] | null,
    key?: EProduct | EDealerUpgrade
  ) => {
    if (!requirements) return <></>;

    return (
      <div>
        {requirements.map((req, index) => (
          <CardRequirement key={index}>
            Requires {req.product} Level {req.level}
          </CardRequirement>
        ))}
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
      <CardContainer key={upgrade.title} locked={locked}>
        <CardHeader>
          <CardImage src={upgrade.image} alt={upgrade.title} />
          <CardDetails>
            <CardInfoColumn>
              <CardTitle>{upgrade.title}</CardTitle>
              <p>Cost: ${price}</p>
              <p>Level: {level}</p>
              {upgradeDiff ? (
                <p style={{ fontSize: "0.7rem" }}>{upgradeDiff}</p>
              ) : (
                <></>
              )}
            </CardInfoColumn>
            <CardInfoColumn>
              {locked ? (
                <Button>Locked</Button>
              ) : (
                <NeonButton
                  onTouchStart={(e) =>
                    handleCardClick(
                      {
                        category,
                        upgrade: key,
                        upgradePrice: price,
                      },
                      e
                    )
                  }
                >
                  Buy
                </NeonButton>
              )}
            </CardInfoColumn>
          </CardDetails>
        </CardHeader>
        <CardContent>
          <CardDescription>{upgrade.description}</CardDescription>
          {locked ? renderRequirements(upgrade.requirements, key) : <></>}
        </CardContent>
      </CardContainer>
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
          const upgradeRequirements = upgrade.requirements;
          let upgradeTo = upgrade.upgradeMultiplier;

          if (userUpgrade?.upgradeAmount && userUpgrade?.amount) {
            upgradeTo = userUpgrade?.amount;
          }
          let upgradeEffect: string | undefined;
          switch (key) {
            case EDealerUpgrade.SOCIAL_MEDIA_CAMPAGIN:
            case EDealerUpgrade.STREET_PROMOTION_TEAM:
            case EDealerUpgrade.CLUB_PARTNERSHIP:
              upgradeEffect = `From ${userInfo.customerAmount} to ${
                userInfo.customerAmount + upgradeTo
              } customers`;
              break;
            case EDealerUpgrade.PRODUCT_QUALITY:
            case EDealerUpgrade.LUXURY_PACKAGING:
            case EDealerUpgrade.HIGH_VALUE_CUSTOMERS:
              upgradeEffect = `Customers buy from ${
                userInfo.customerNeeds
              } to ${userInfo.customerNeeds + upgradeTo} more product`;
              break;
          }

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
          const userUpgrades = userInfo.products;
          const userUpgrade = userUpgrades.find((u) => u.name === key);
          const price = userUpgrade?.upgradePrice || upgrade.basePrice;
          const level = userUpgrade?.level || 0;
          let upgradeDiff =
            userUpgrade?.upgradeMarketDiscount! - userUpgrade?.marketDiscount!;
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
            upgradeDiff
              ? `Market discount: ${upgradeDiff.toFixed(2)}%`
              : undefined,
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
