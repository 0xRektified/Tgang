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
  userInfo: IUserInfo,
  slottedProducts: Product[],
  productName: string,
  amountToSell: number,
  marketInfo: IMarketInfo | undefined
): {
  updatedProducts: Product[];
  transaction: Transaction;
  cashState: number;
} => {
  let amountEarned = 0;
  let cashState = userInfo.cashAmount;
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
