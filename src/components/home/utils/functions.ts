import { IMarketInfo } from "../../interfaces/market.interface";
import { EProduct } from "../../interfaces/product.interface";
import { IUserInfo, Product } from "../../interfaces/user.interface";
import { Transaction } from "./types";

export const calculateTotalQuantity = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.quantity, 0);
};

export const updateProducts = (
  products: Product[],
  productName: string,
  quantity: number
): Product[] => {
  return products.map((product) => {
    if (product.name === productName && product.quantity >= quantity) {
      return { ...product, quantity: product.quantity - quantity };
    }
    return product;
  });
};

export const getSellQuantity = (user: IUserInfo, product: EProduct) => {
  const dealerUpgrade = user.dealerUpgrades.find((u) => u.product === product);
  return dealerUpgrade ? dealerUpgrade.level + 1 : 1;
};

export const handleTransaction = (
  userInfo: IUserInfo,
  productToSell: Product,
  marketInfo: IMarketInfo | undefined
): {
  updatedProducts: Product[];
  transaction: Transaction;
  cashState: number;
} => {
  let amountEarned = 0;
  let cashState = userInfo.cashAmount;
  const amountToSell = getSellQuantity(userInfo, productToSell.name);
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
    console.log(`marketInfo`);
    console.log(marketInfo);
    if (productMarket && userInfo) {
      let productPrice = productMarket.price;
      amountEarned = amountToSell * productPrice;
      cashState += amountEarned;

      const updatedProducts = updateProducts(
        userInfo.products,
        productName,
        amountToSell
      );
      const transaction = {
        type: "success",
        product: productToSell.name,
        quantity: amountToSell,
        amountEarned: amountEarned,
      } as Transaction;
      return { updatedProducts, transaction, cashState };
    } else if (productToSell) {
      const transaction = {
        type: "missed",
        product: productToSell.name,
        quantity: amountToSell,
      } as Transaction;
      return { updatedProducts: userInfo.products, transaction, cashState };
    } else {
      const inventoryProduct = userInfo.products.find(
        (product) => product.name === productName
      );
      if (inventoryProduct) {
        const transaction = {
          type: "missed",
          product: inventoryProduct.name,
          quantity: amountToSell,
        } as Transaction;
        return { updatedProducts: userInfo.products, transaction, cashState };
      }
    }
  }

  return {
    updatedProducts: userInfo.products,
    transaction: {
      type: "missed",
      product: "Unknown",
      quantity: 0,
    } as Transaction,
    cashState,
  };
};
