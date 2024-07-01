import { Product, Transaction } from "./types";

export const calculateTotalQuantity = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.quantity, 0);
};

export const updateProducts = (
  products: Product[],
  productId: number,
  amountToSell: number
): Product[] => {
  return products.map((product) => {
    if (product.id === productId && product.quantity >= amountToSell) {
      return { ...product, quantity: product.quantity - amountToSell };
    }
    return product;
  });
};

export const handleTransaction = (
  slottedProducts: Product[],
  products: Product[],
  productId: number,
  amountToSell: number,
  marketPrice: Record<string, number>,
  setCashAmount: React.Dispatch<React.SetStateAction<number>>
): { updatedProducts: Product[]; transaction: Transaction | null } => {
  let amountEarned = 0;
  const productToSell = slottedProducts.find(
    (product) => product.id === productId
  );

  if (productToSell && productToSell.quantity >= amountToSell) {
    const productName = productToSell.name;
    amountEarned = amountToSell * marketPrice[productName];
    setCashAmount((prevCash) => prevCash + amountEarned);
    const updatedProducts = updateProducts(products, productId, amountToSell);
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
      (product) => product.id === productId
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
