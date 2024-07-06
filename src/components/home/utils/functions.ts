import { Product } from "../../interfaces/user.interface";
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
  slottedProducts: Product[],
  products: Product[],
  productName: string,
  amountToSell: number,
  marketPrice: Record<string, number>,
  setCashAmount: React.Dispatch<React.SetStateAction<number>>
): { updatedProducts: Product[]; transaction: Transaction | null } => {
  let amountEarned = 0;
  const productToSell = slottedProducts.find(
    (product) => product.name === productName
  );

  if (productToSell && productToSell.quantity >= amountToSell) {
    const productName = productToSell.name;
    amountEarned = amountToSell * marketPrice[productName];
    setCashAmount((prevCash) => prevCash + amountEarned);
    const updatedProducts = updateProducts(products, productName, amountToSell);
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

  return { updatedProducts: products, transaction: null };
};
