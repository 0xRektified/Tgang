import React from "react";
import { LuPackagePlus } from "react-icons/lu";
import { MdConveyorBelt } from "react-icons/md";
import { LabPlot, IUserInfo } from "../interfaces/user.interface";

import { UpgradeConfirmationModal } from "../UpgradeConfirmationModal";

interface PurchasedLabModalProps {
  plot: LabPlot;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  upgradeLabCapacity: (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
  upgradeLabProduction: (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => Promise<void>;
}

const PurchasedLabModal: React.FC<PurchasedLabModalProps> = ({
  plot,
  onClose,
  setUserInfo,
  upgradeLabCapacity,
  upgradeLabProduction,
}) => {
  const upgradeCapacity = async () => {
    await upgradeLabCapacity(plot.plotId, setUserInfo);
    onClose();
  };

  const upgradeProduction = async () => {
    await upgradeLabProduction(plot.plotId, setUserInfo);
    onClose();
  };

  const upgradeCapacityDiff = plot.lab?.upgradeCapacity! - plot.lab?.capacity!;
  const upgradeProductionDiff =
    plot.lab?.upgradeProduction! - plot.lab?.production!;

  const options = [
    {
      label: "Capacity +",
      valueDiff: upgradeCapacityDiff.toString(),
      price: plot.lab?.upgradeCapacityPrice || 0,
      icon: <LuPackagePlus />,
      onClick: upgradeCapacity,
    },
    {
      label: "Production +",
      valueDiff: `${upgradeProductionDiff}/h`,
      price: plot.lab?.upgradeProductionPrice || 0,
      icon: <MdConveyorBelt />,
      onClick: upgradeProduction,
    },
  ];

  return (
    <UpgradeConfirmationModal
      title="Lab Details"
      options={options}
      onClose={onClose}
    />
  );
};

export default PurchasedLabModal;
