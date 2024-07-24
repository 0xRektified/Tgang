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
import { EShippingMethod, IShippingMethod } from "../interfaces/shipping.interface";
import { useBuyShippingMethod } from "../../hooks/useBuyShippingMethod";

interface RenderShippingProps {
  userInfo: IUserInfo;
  tab: string;
  shippingMethods: Record<EShippingMethod, IShippingMethod> | undefined;
  setTouchPoints: React.Dispatch<React.SetStateAction<TouchPoint[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const RenderShipping: React.FC<RenderShippingProps> = ({
  userInfo,
  tab,
  shippingMethods,
  setTouchPoints,
  setUserInfo,
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
    upgrade: IShippingMethod,
    key: EShippingMethod,
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
              {/* {locked ? (
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
              )} */}
            </CardInfoColumn>
          </CardDetails>
        </CardHeader>
        <CardContent>
          <CardDescription>{upgrade.description}</CardDescription>
          {/* {locked ? renderRequirements(upgrade.requirements, key) : <></>} */}
        </CardContent>
      </CardContainer>
    );
  };

  const renderUpgradeCategory = (
    categoryTitle: string,
    upgrades: Record<EShippingMethod, IShippingMethod>,
  ) => (
    <div key={categoryTitle}>
      <h3 className="text-2xl font-semibold capitalize">{categoryTitle}</h3>
      <div className="space-y-2">
        {Object.entries(upgrades ?? {}).map(([key, upgrade]) => {
          // const userUpgrade = userUpgrades.find((u) => u.product === key);
          // const price = userUpgrade?.upgradePrice || upgrade.basePrice;
          // const level = userUpgrade?.level || 0;
          // const upgradeRequirements = upgrade.requirements;
          // let locked = false;
          // if (upgradeRequirements) {
          //   locked = upgradeRequirements.some((req) => {
          //     const requiredProduct = userInfo.products.find(
          //       (u) => u.name === req.product
          //     );
          //     return !requiredProduct || requiredProduct.level < req.level;
          //   });
          // }

          return renderUpgrade(
            upgrade,
            key as EShippingMethod,
            0,
            0,
          );
        })}
      </div>
    </div>
  );

  if (!shippingMethods) return <></>;

  const renderAllShippingCategories = () => (
    <>
      {renderUpgradeCategory(
        "Methods",
        shippingMethods,
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {tab === "shipping" && renderAllShippingCategories()}
    </div>
  );
};
