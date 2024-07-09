import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { EProduct } from "../components/interfaces/product.interface";
import {
  IUpgrade,
  IUpgradesCategory,
} from "../components/interfaces/upgrade.interface";
import {
  IUserInfo,
  IUserUpgrade,
} from "../components/interfaces/user.interface";

export function useBuyUpgrades() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyUpgrade = async (
    upgrade: IUpgrade,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setUpgrades: React.Dispatch<
      React.SetStateAction<IUpgradesCategory[] | undefined>
    >,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`inside buy upgrade`);
      const upgradeId = upgrade.id;
      const response = await axiosInstance.post(`/upgrades/buy`, {
        id: upgradeId,
      });
      console.log(`response Buy upgrade`, response);

      const newCashAmount = response.data.cashAmount;
      const updatedUpgrades = response.data.upgrades;

      setCashAmount(newCashAmount);

      setUpgrades((prevUpgrades) => {
        if (!prevUpgrades) return prevUpgrades;

        return prevUpgrades.map((category) => {
          return {
            ...category,
            upgrades: category.upgrades.map((upgrade) => {
              const updatedUpgrade = updatedUpgrades.find(
                (u: IUserUpgrade) => u.id === upgrade.id
              );
              if (updatedUpgrade) {
                return {
                  ...upgrade,
                  level: updatedUpgrade.level,
                  locked: updatedUpgrade.locked,
                };
              }
              return upgrade;
            }),
          };
        });
      });

      if (upgrade.group === "product") {
        setUserInfo((prevUserInfo) => {
          console.log(`prevUserInfo`);
          console.log(prevUserInfo);
          if (!prevUserInfo) return prevUserInfo;

          const newProduct = {
            name: upgrade.title as EProduct,
            quantity: 0,
            unlocked: true,
            selected: true,
            maxCarry: 100,
            slot: 1,
          };

          const productExists = prevUserInfo.products.some(
            (product) => product.name === newProduct.name
          );

          if (!productExists) {
            console.log(`product did not exist`);
            console.log(productExists);
            return {
              ...prevUserInfo,
              products: [...prevUserInfo.products, newProduct],
            };
          }

          return prevUserInfo;
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { buyUpgrade, loading, error };
}
