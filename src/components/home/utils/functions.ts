import { IMarketInfo } from "../../interfaces/market.interface";
import { IUserInfo, Product } from "../../interfaces/user.interface";
import { Transaction } from "./types";

export const calculateTotalQuantity = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.quantity, 0);
};

export const updateProducts = (
  products: Product[],
  productName: string,
  amountToSell: number
): Product[] => {
  return products.map((product) => {
    if (product.name === productName && product.quantity >= amountToSell) {
      return { ...product, quantity: product.quantity - amountToSell };
    }
    return product;
  });
};

export const handleTransaction = (
  userInfo: IUserInfo | undefined,
  slottedProducts: Product[],
  products: Product[],
  productName: string,
  amountToSell: number,
  marketInfo: IMarketInfo | undefined,
  setCashAmount: React.Dispatch<React.SetStateAction<number>>,
  setCarryAmount: React.Dispatch<React.SetStateAction<number>>
): { updatedProducts: Product[]; transaction: Transaction | null } => {
  let amountEarned = 0;
  const productToSell = slottedProducts.find(
    (product) => product.name === productName
  );
  if (
    productToSell &&
    marketInfo &&
    marketInfo.products.length > 0 &&
    productToSell.quantity >= amountToSell
  ) {
    const productName = productToSell.name;

    const productMarket = marketInfo.products.find(
      (e) => e.name === productName
    );
    if (productMarket && userInfo) {
      let productPrice = productMarket.price;
      const productUpgrade = userInfo.upgrades.find(
        (u) => u.title === productName
      );
      if (productUpgrade) {
        const discountValue = productUpgrade.value[productUpgrade.level];
        productPrice = productPrice / discountValue;
      }
      amountEarned = amountToSell * productPrice;
      setCashAmount((prevCash) => prevCash + amountEarned);
      setCarryAmount((prevCarry) => prevCarry - productToSell.quantity);

      const updatedProducts = updateProducts(
        products,
        productName,
        amountToSell
      );
      const transaction = {
        type: "success",
        product: productToSell.name,
        quantity: amountToSell,
        amountEarned: amountEarned,
      } as Transaction;
      return { updatedProducts, transaction };
    } else if (productToSell) {
      const transaction = {
        type: "missed",
        product: productToSell.name,
        quantity: amountToSell,
      } as Transaction;
      return { updatedProducts: products, transaction };
    } else {
      const inventoryProduct = products.find(
        (product) => product.name === productName
      );
      if (inventoryProduct) {
        const transaction = {
          type: "missed",
          product: inventoryProduct.name,
          quantity: amountToSell,
        } as Transaction;
        return { updatedProducts: products, transaction };
      }
    }
  }

  return { updatedProducts: products, transaction: null };
};
