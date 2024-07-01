import React, { useState } from "react";
import { supplierPrice } from "../../../mocks/backend.mock";
import WebApp from "@twa-dev/sdk";
import { Product } from "../utils/types";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
  cashAmount,
  setCashAmount,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("Weed");
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleBuy = () => {
    const cost =
      supplierPrice[selectedProduct as keyof typeof supplierPrice] * quantity;
    if (cashAmount >= cost) {
      setCashAmount(cashAmount - cost);

      // Update products in inventory and slots
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.name === selectedProduct
            ? { ...product, quantity: product.quantity + quantity }
            : product
        )
      );

      WebApp.HapticFeedback.impactOccurred("heavy");
      onClose();
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000); // Display for 3 seconds, then 1s to slide out
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Buy Products - ${cashAmount}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.keys(supplierPrice).map((product) => (
              <option key={product} value={product}>
                {product} - $
                {supplierPrice[product as keyof typeof supplierPrice]}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Buy
          </button>
        </div>
      </div>
      {showToast && (
        <div className="fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right">
          <div className="toast toast-top toast-end">
            <div className="alert alert-error p-4 rounded shadow-lg text-white bg-red-600 font-bold">
              <span>Not enough cash.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
