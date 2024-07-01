import { Product } from "../components/home/utils/types";

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
    unlocked: true,
    selected: true,
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
];

export const marketPrice = { Weed: 20, Coke: 50, Meth: 10 };
export const supplierPrice = { Weed: 18, Coke: 45, Meth: 9 };
export const customerList = [{ 1: 10 }, { 2: 1 }, { 3: 5 }, { 1: 1 }, { 1: 1 }];
export const userCashAmount = 100;
