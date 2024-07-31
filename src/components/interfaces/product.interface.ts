export enum EProduct {
  WEED = "Weed",
  COCAINE = "Coke",
  MDMA = "MDMA",
  METH = "Meth",
  LSD = "LSD",
  // HEROIN = "Heroin",
  MUSHROOM = "Mushroom",
  // AMPHETAMINE = "Amphetamine",
}

export enum EProductIcon {
  Weed = "🌱",
  Coke = "🧂",
  MDMA = "💊",
  Meth = "💎",
  // Heroin = "🦯",
  LSD = "🧪",
  Mushroom = "🍄",
  // Amphetamine = "💊",
}

export const ProductImage: Record<EProduct, string> = {
  [EProduct.WEED]: "assets/product/seedling.svg",
  [EProduct.COCAINE]: "assets/product/salt.svg",
  [EProduct.MDMA]: "assets/product/pill.svg",
  [EProduct.METH]: "assets/product/gem.svg",
  [EProduct.LSD]: "assets/product/testtube.svg",
  [EProduct.MUSHROOM]: "assets/product/mushroom.svg",
}
