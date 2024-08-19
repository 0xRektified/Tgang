export enum EProduct {
  HERB = "Herb",
  MUSHROOM = "Mushroom",
  ACID = "Acid",
  CRYSTAL = "Crystal",
  PILL = "Pill",
  POWDER = "Powder",
}

export enum EProductIcon {
  Herb = "🌱",
  Mushroom = "🍄",
  Acid = "🧪",
  Pill = "💊",
  Crystal = "💎",
  Powder = "🧂",
}

export const ProductImage: Record<EProduct, string> = {
  [EProduct.HERB]: "assets/product/seedling.svg",
  [EProduct.MUSHROOM]: "assets/product/mushroom.svg",
  [EProduct.ACID]: "assets/product/testtube.svg",
  [EProduct.CRYSTAL]: "assets/product/gem.svg",
  [EProduct.PILL]: "assets/product/pill.svg",
  [EProduct.POWDER]: "assets/product/salt.svg",
};
