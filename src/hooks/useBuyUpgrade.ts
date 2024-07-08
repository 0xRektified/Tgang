import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUpgradesCategory } from "../components/interfaces/upgrade.interface";
import { IUserUpgrade, Product } from "../components/interfaces/user.interface";

export function useBuyUpgrades() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyUpgrade = async (
    upgradeId: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setUpgrades: React.Dispatch<
      React.SetStateAction<IUpgradesCategory[] | undefined>
    >
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`inside buy upgrade`);
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
