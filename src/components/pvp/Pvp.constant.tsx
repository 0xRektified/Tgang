import {
    FaBomb,
    FaBullseye,
    FaHeart,
    FaShieldAlt,
    FaSkull,
    FaTrophy,
  } from "react-icons/fa";
import { GiDodging } from "react-icons/gi";

export const statIcons = [
    {
      icon: FaTrophy,
      label: "Victories",
      description: "Total number of PvP battles won",
    },
    {
      icon: FaSkull,
      label: "Defeats",
      description: "Total number of PvP battles lost",
    },
    {
      icon: FaBullseye,
      label: "Accuracy",
      description: "Chance to hit the opponent in battle",
    },
    {
      icon: FaHeart,
      label: "Base HP",
      description: "Base health points of the character",
    },
    {
      icon: FaBomb,
      label: "Damage",
      description: "Amount of damage dealt in battles",
    },
    {
      icon: GiDodging,
      label: "Evasion",
      description: "Chance to dodge enemy attacks",
    },
    {
      icon: FaShieldAlt,
      label: "Protection",
      description: "Percentage of damage reduction",
    },
  ];