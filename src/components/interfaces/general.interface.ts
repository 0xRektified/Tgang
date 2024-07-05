import { Upgrades } from "../shop/utils/types";

export type ProductName = "Weed" | "Coke" | "Meth";

export const tabMapping: { [key: string]: keyof Upgrades } = {
  Weed: "dealer",
  Coke: "dealer",
  Meth: "dealer",
  Heroin: "dealer",
  MDMA: "dealer",
  LSD: "dealer",
  Ketamine: "dealer",
  "Psilocybin Mushrooms": "dealer",
  PCP: "dealer",
  DMT: "dealer",
};
