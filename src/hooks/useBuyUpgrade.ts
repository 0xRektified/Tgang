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
      const upgradeId = upgrade.id;
      const response = await axiosInstance.post(`/upgrades/buy`, {
        id: upgradeId,
      });
      const newUserInfo = response.data;
      const newCashAmount = newUserInfo.cashAmount;
      const updatedUpgrades = newUserInfo.upgrades;

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

      setUserInfo((prevUserInfo) => {
        if (!prevUserInfo) return newUserInfo;

        const updatedUserInfo = {
          ...prevUserInfo,
          cashAmount: newUserInfo.cashAmount,
          upgrades: newUserInfo.upgrades,
          products: newUserInfo.products,
        };
        return updatedUserInfo;
      });
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
