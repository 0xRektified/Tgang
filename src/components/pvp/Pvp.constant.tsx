import {
  FaBomb,
  FaBullseye,
  FaHeart,
  FaShieldAlt,
  FaSkull,
  FaTrophy,
  FaFistRaised,
} from "react-icons/fa";
import { GiDodging } from "react-icons/gi";

export const statIcons = [
  {
    key: "victory",
    icon: FaTrophy,
    label: "Victories",
    description: "Total number of PvP battles won",
  },
  {
    key: "defeat",
    icon: FaSkull,
    label: "Defeats",
    description: "Total number of PvP battles lost",
  },
  {
    key: "accuracy",
    icon: FaBullseye,
    label: "Accuracy",
    description: "Chance to hit the opponent in battle",
  },
  {
    key: "healthPoints",
    icon: FaHeart,
    label: "Base HP",
    description: "Base health points of the character",
  },
  {
    key: "damage",
    icon: FaBomb,
    label: "Damage",
    description: "Amount of damage dealt in battles",
  },
  {
    key: "evasion",
    icon: GiDodging,
    label: "Evasion",
    description: "Chance to dodge enemy attacks",
  },
  {
    key: "protection",
    icon: FaShieldAlt,
    label: "Protection",
    description: "Percentage of damage reduction",
  },
  {
    key: "criticalChance",
    icon: FaFistRaised,
    label: "Critical Chance",
    description: "Chance for critical hits",
  },
];

export const renderStatIcon = (key: string, color?: string) => {
  const statIcon = statIcons.find(icon => icon.key === key);
  if (!statIcon) return null;
  
  const IconComponent = statIcon.icon;
  return <IconComponent style={color ? { color } : undefined} />;
};
