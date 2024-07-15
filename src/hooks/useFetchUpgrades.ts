import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUpgradesCategory } from "../components/interfaces/upgrade.interface";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useFetchUpgrades(userInfo: IUserInfo | null) {
  const [upgrades, setUpgrades] = useState<IUpgradesCategory[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpgrades = useCallback(async () => {
    try {
      setLoading(true);
      const upgradesResponse = await axiosInstance.get<IUpgradesCategory[]>(
        `/upgrades`
      );

      let updatedUpgrades = upgradesResponse.data;

      if (userInfo?.upgrades) {
        const userUpgradesMap = new Map<
          number,
          { level: number; locked: boolean }
        >(
          userInfo.upgrades.map((upgrade) => [
            upgrade.id,
            { level: upgrade.level, locked: upgrade.locked },
          ])
        );
        updatedUpgrades = upgradesResponse.data.map((category) => {
          const updatedCategory = {
            ...category,
            upgrades: category.upgrades.map((upgrade) => {
              const userUpgrade = userUpgradesMap.get(upgrade.id);
              if (userUpgrade !== undefined) {
                return {
                  ...upgrade,
                  level: userUpgrade.level,
                  locked: userUpgrade.locked,
                };
              }
              return upgrade;
            }),
          };
          return updatedCategory;
        });
      }

      setUpgrades(updatedUpgrades);
      return { upgrades: updatedUpgrades };
    } catch (error) {
      console.error("Failed to fetch upgrades data:", error);
      setError("Failed to fetch upgrades data");
      return { upgrades: [] };
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  return { upgrades, setUpgrades, loading, error, fetchUpgrades };
}
