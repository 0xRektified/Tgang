import React from "react";
import { LuPackagePlus } from "react-icons/lu";
import { MdConveyorBelt } from "react-icons/md";
import { LabPlot, IUserInfo } from "../interfaces/user.interface";
import { useUpgradeLabCapacity } from "../../hooks/useUpgradeLabCapacity";
import { useUpgradeLabProduction } from "../../hooks/useUpgradeLabProduction";
import { UpgradeConfirmationModal } from "../UpgradeConfirmationModal";

interface PurchasedLabModalProps {
  plot: LabPlot;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const PurchasedLabModal: React.FC<PurchasedLabModalProps> = ({
  plot,
  onClose,
  setUserInfo,
}) => {
  const { upgradeLabCapacity } = useUpgradeLabCapacity();
  const { upgradeLabProduction } = useUpgradeLabProduction();

  const upgradeCapacity = () => {
    upgradeLabCapacity(plot.plotId, setUserInfo);
    onClose();
  };

  const upgradeProduction = () => {
    upgradeLabProduction(plot.plotId, setUserInfo);
    onClose();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
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
      valueDiff: upgradeProductionDiff.toString(),
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
