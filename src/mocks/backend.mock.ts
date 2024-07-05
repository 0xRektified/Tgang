import { Product } from "../components/home/utils/types";
import { Upgrades } from "../components/shop/utils/types";

/****************************************************
                        Home View
*****************************************************/
export const productsData: Product[] = [
  {
    id: 1,
    name: "Weed",
    unlocked: true,
    selected: true,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 2,
    name: "Coke",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 3,
    name: "Meth",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 4,
    name: "Heroin",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 5,
    name: "MDMA",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 6,
    name: "LSD",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 7,
    name: "Ketamine",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 8,
    name: "Psilocybin Mushrooms",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 9,
    name: "PCP",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
  {
    id: 10,
    name: "DMT",
    unlocked: false,
    selected: false,
    quantity: 0,
    maxCarry: 100,
    slot: null,
  },
];

export const marketPrice = {
  Weed: 20,
  Coke: 50,
  Meth: 10,
  Heroin: 150,
  MDMA: 25,
  LSD: 5,
  Ketamine: 25,
  Psilocybin_Mushrooms: 7,
  PCP: 30,
  DMT: 300,
};

export const supplierPrice = {
  Weed: 18,
  Coke: 45,
  Meth: 9,
  Heroin: 135,
  MDMA: 22.5,
  LSD: 4.5,
  Ketamine: 22.5,
  Psilocybin_Mushrooms: 6.3,
  PCP: 27,
  DMT: 270,
};

export const customerList = [{ 1: 10 }, { 2: 1 }, { 3: 5 }, { 1: 1 }, { 1: 1 }];
export const userCashAmount = 1000;

/****************************************************
                        Shop View
*****************************************************/
export const upgrades: Upgrades = {
  dealer: [
    {
      id: 1,
      title: "Coke",
      description: "Increase the number of item to carry",
      level: 0,
      maxLevel: 5,
      cost: 100,
      image: "/assets/cc.png",
      locked: false,
      requirement: null,
    },
    {
      id: 2,
      title: "Meth",
      description: "Increase the number of item to carry",
      level: 0,
      maxLevel: 5,
      cost: 200,
      image: "/assets/meth.png",
      locked: true,
      requirement: { title: "Coke", level: 1 },
    },
    {
      id: 3,
      title: "Heroin",
      description: "Increase the number of item to carry",
      level: 0,
      maxLevel: 5,
      cost: 200,
      image: "/assets/hero.png",
      locked: true,
      requirement: { title: "Meth", level: 1 },
    },
  ],
  farmer: [
    {
      id: 4,
      title: "Weed_lab",
      description: "Start your weed production",
      level: 3,
      maxLevel: 5,
      cost: 300,
      image:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      locked: false,
      requirement: null,
    },
  ],
  gangster: [
    {
      id: 5,
      title: "Workout",
      description: "Increase you health score",
      level: 4,
      maxLevel: 5,
      cost: 400,
      image:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      locked: false,
      requirement: null,
    },
  ],
};
