import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUpgradesCategory } from "../components/interfaces/upgrade.interface";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useFetchUpgrades(userInfo: IUserInfo | undefined) {
  const [upgrades, setUpgrades] = useState<IUpgradesCategory[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUpgrades = async () => {
      try {
        const upgradesResponse = await axiosInstance.get<IUpgradesCategory[]>(
          `/upgrades`
        );

        let updatedUpgrades = upgradesResponse.data;

        if (userInfo?.upgrades) {
          const userUpgradesMap = new Map<number, number>(
            userInfo.upgrades.map((upgrade) => [upgrade.id, upgrade.level])
          );

          updatedUpgrades = upgradesResponse.data.map((category) => {
            const updatedCategory = {
              ...category,
              upgrades: category.upgrades.map((upgrade) => {
                const userUpgradeLevel = userUpgradesMap.get(upgrade.id);
                if (userUpgradeLevel !== undefined) {
                  return { ...upgrade, level: userUpgradeLevel };
                }
                return upgrade;
              }),
            };
            return updatedCategory;
          });
        }

        setUpgrades(updatedUpgrades);
      } catch (error) {
        console.error("Failed to fetch upgrades data:", error);
        setError("Failed to fetch upgrades data");
      } finally {
        setLoading(false);
      }
    };

    getUpgrades();
  }, [userInfo]);

  return { upgrades, setUpgrades, loading, error };
}
