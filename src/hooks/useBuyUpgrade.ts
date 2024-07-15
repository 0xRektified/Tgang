import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
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
    setUpgrades: React.Dispatch<
      React.SetStateAction<IUpgradesCategory[] | undefined>
    >,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const upgradeId = upgrade.id;
      const response = await axiosInstance.post(`/upgrades/buy`, {
        id: upgradeId,
        group: upgrade.group,
      });
      const newUserInfo = response.data as IUserInfo;
      setUserInfo(newUserInfo);

      const updatedUpgrades = newUserInfo.upgrades;

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
