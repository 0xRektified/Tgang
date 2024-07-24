import React from "react";
import { TouchPoint } from "./utils/types";
import WebApp from "@twa-dev/sdk";
import {
  DealerUpgrade,
  EDealerUpgrade,
  EShippingUpgrade,
  EUpgradeCategory,
  IUpgrade,
  ProductUpgrade,
  ShippingUpgrade,
} from "../interfaces/upgrade.interface";
import { useBuyUpgrades } from "../../hooks/useBuyUpgrade";
import {
  IUserInfo,
  Product,
  UserDealerUpgrade,
  UserShippingUpgrade,
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

interface RenderUpgradesProps {
  userInfo: IUserInfo;
  tab: string;
  upgradesData: IUpgrade | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setUpgrades: React.Dispatch<React.SetStateAction<IUpgrade | undefined>>;
}

export const RenderUpgrades: React.FC<RenderUpgradesProps> = ({
  userInfo,
  tab,
  upgradesData,
  setTouchPoints,
  setUserInfo,
}) => {
  const { buyUpgrade } = useBuyUpgrades();

  const handleBuyUpgrade = async (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade | EShippingUpgrade;
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
    }
  };

  const handleCardClick = (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade | EShippingUpgrade;
      upgradePrice: number;
    },
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    const touch = e.touches[0];

    handleBuyUpgrade(params, touch);
  };

  const renderRequirements = (
    requirements: { product: string; level: number }[] | null,
    key?: EProduct | EDealerUpgrade | EShippingUpgrade
  ) => {
    if (key === EShippingUpgrade.SHIPPING_CONTAINERS) {
      const containerUpgrade = userInfo.shippingUpgrades.find(
        (u) => u.product === key
      );
      return renderContainerRequirements(
        containerUpgrade ? containerUpgrade.level : 0
      );
    }

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

  const renderContainerRequirements = (level: number) => {
    return (
      <div>
        <CardRequirement>
          Requires {level} referrals to unlock next level
        </CardRequirement>
      </div>
    );
  };

  const renderUpgrade = (
    upgrade: ProductUpgrade | DealerUpgrade | ShippingUpgrade,
    key: EProduct | EDealerUpgrade | EShippingUpgrade,
    category: EUpgradeCategory,
    price: number,
    level: number,
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

  const renderUpgradeCategory = <
    T extends { level: number; product: string; upgradePrice: number }
  >(
    categoryTitle: string,
    upgrades: Record<string, ProductUpgrade | DealerUpgrade> | undefined,
    category: EUpgradeCategory,
    userUpgrades: T[]
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
          const userUpgrade = userUpgrades.find((u) => u.product === key);
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
            key as EProduct | EDealerUpgrade | EShippingUpgrade,
            category,
            price,
            level,
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
    userUpgrades: Product[]
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
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
            key as EProduct | EDealerUpgrade | EShippingUpgrade,
            category,
            price,
            level,
            locked
          );
        })}
      </div>
    </div>
  );

  const renderShippingCategory = <
    T extends { level: number; product: string; upgradePrice: number }
  >(
    categoryTitle: string,
    upgrades: Record<string, ShippingUpgrade> | undefined,
    category: EUpgradeCategory,
    userUpgrades: T[]
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
          const userUpgrade = userUpgrades.find((u) => u.product === key);
          const price = userUpgrade?.upgradePrice || upgrade.basePrice;
          const level = userUpgrade?.level || 0;
          let locked = false;
          if (key === EShippingUpgrade.SHIPPING_CONTAINERS) {
            const referrals = userInfo.referredUsers.length;
            if (userUpgrade?.level! - 1 >= referrals) {
              locked = true;
            }
          }

          return renderUpgrade(
            upgrade,
            key as EProduct | EDealerUpgrade | EShippingUpgrade,
            category,
            price,
            level,
            locked
          );
        })}
      </div>
    </div>
  );

  if (!upgradesData) return <></>;

  const renderAllDealerCategories = () => (
    <>
      {renderUpgradeCategory<UserDealerUpgrade>(
        "Customers",
        upgradesData?.dealer ?? {},
        EUpgradeCategory.DEALER,
        userInfo.dealerUpgrades
      )}
      {renderProductCategory(
        "Products",
        upgradesData?.product ?? {},
        EUpgradeCategory.PRODUCT,
        userInfo.products
      )}
      {renderShippingCategory<UserShippingUpgrade>(
        "Shipping",
        upgradesData?.shipping ?? {},
        EUpgradeCategory.SHIPPING,
        userInfo.shippingUpgrades
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {tab === "dealer" && renderAllDealerCategories()}
    </div>
  );
};
