export enum EProduct {
  WEED = "Weed",
  MUSHROOM = "Mushroom",
  LSD = "Acid",
  MDMA = "Ecstasy",
  METH = "Meth",
  COCAINE = "Coke",
}

export enum EProductIcon {
  Weed = "🌱",
  Mushroom = "🍄",
  LSD = "🧪",
  MDMA = "💊",
  Meth = "💎",
  Coke = "🧂",
}

export const ProductImage: Record<EProduct, string> = {
  [EProduct.WEED]: "assets/product/seedling.svg",
  [EProduct.MUSHROOM]: "assets/product/mushroom.svg",
  [EProduct.LSD]: "assets/product/testtube.svg",
  [EProduct.METH]: "assets/product/gem.svg",
  [EProduct.MDMA]: "assets/product/pill.svg",
  [EProduct.COCAINE]: "assets/product/salt.svg",
}
