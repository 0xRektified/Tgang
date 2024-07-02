import React, { useState } from "react";
import styled from "styled-components";
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

const ModalContainer = styled.div`
  background-color: #2d3748;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e0;
  margin-bottom: 0.5rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #cbd5e0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #63b3ed;
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #cbd5e0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #63b3ed;
  }
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  transition: background-color 0.3s;

  &.cancel {
    background-color: #718096;
    margin-right: 0.5rem;

    &:hover {
      background-color: #4a5568;
    }
  }

  &.buy {
    background-color: #48bb78;

    &:hover {
      background-color: #38a169;
    }
  }

  &.max {
    background-color: #63b3ed;

    &:hover {
      background-color: #4299e1;
    }
  }
`;

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

  const handleMaxClick = () => {
    const productPrice =
      supplierPrice[selectedProduct as keyof typeof supplierPrice];
    const maxQuantity = Math.floor(cashAmount / productPrice);
    setQuantity(maxQuantity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <ModalContainer>
        <h2 className="text-xl font-bold mb-4 text-white">
          Buy Products - ${cashAmount}
        </h2>
        <div className="mb-4">
          <StyledLabel>Product</StyledLabel>
          <StyledSelect
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {Object.keys(supplierPrice).map((product) => (
              <option key={product} value={product}>
                {product} - $
                {supplierPrice[product as keyof typeof supplierPrice]}
              </option>
            ))}
          </StyledSelect>
        </div>
        <div className="mb-4">
          <StyledLabel>Quantity</StyledLabel>
          <StyledInputContainer>
            <StyledInput
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <StyledButton onClick={handleMaxClick} className="max">
              Max
            </StyledButton>
          </StyledInputContainer>
        </div>
        <div className="flex justify-end">
          <StyledButton onClick={onClose} className="cancel">
            Cancel
          </StyledButton>
          <StyledButton onClick={handleBuy} className="buy">
            Buy
          </StyledButton>
        </div>
      </ModalContainer>
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
