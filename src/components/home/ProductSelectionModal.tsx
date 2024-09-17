import React, { useState } from "react";
import { IUserInfo, Product } from "../interfaces/user.interface";
import styled from "styled-components";

import {
  ModalContainer,
  CloseButton,
  CardContainer,
  CardTitle,
  CardDetails,
  CardInfoColumn,
  ScrollableTableContainer,
  ClickableText,
} from "./styles/shipping.css";
import { EShippingMethod } from "../interfaces/shipping.interface";
import { EProduct, ProductImage } from "../interfaces/product.interface";

const ProductCard = styled(CardContainer)`
  margin-bottom: 15px;
  cursor: pointer;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ProductImageStyled = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 0.8rem;
  margin-bottom: 0.5rem;
`;

const NeonButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.8rem auto;
  border: 2px solid #1e90ff;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  width: 8em;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;

  &:hover:not(:disabled) {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:disabled {
    background-color: rgb(99 99 99);
    border: none;
    cursor: not-allowed;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff,
        0 0 8px #1e90ff;
    }
    100% {
      box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff,
        0 0 20px #1e90ff;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

// New styled components for centering and padding
const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
`;

const CenteredCardDetails = styled(CardDetails)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenteredCardInfoColumn = styled(CardInfoColumn)`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

interface ProductSelectionModalProps {
  userInfo: IUserInfo;
  onClose: () => void;
  shippingMethod: EShippingMethod;
  amount: number;
  handleShip: (
    shippingMethod: EShippingMethod,
    product: EProduct,
    amount: number,
  ) => void;
  onRedirectToTilkRoad: () => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  userInfo,
  onClose,
  shippingMethod,
  amount,
  handleShip,
  onRedirectToTilkRoad,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const userHasProducts = userInfo.products.some(
    (product) => product.quantity > 0,
  );

  const calculateAmountToShip = async (
    shippingMethod: EShippingMethod,
    selectedProduct: Product,
  ) => {
    await handleShip(
      shippingMethod,
      selectedProduct.name,
      Math.min(selectedProduct.quantity, amount),
    );
    onClose();
  };

  return (
    <ModalContainer className="scrollable-content">
      <CloseButton onClick={onClose}>×</CloseButton>
      <ModalTitle>Select a Product to Ship</ModalTitle>
      {userHasProducts ? (
        <ScrollableTableContainer>
          {userInfo.products
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <ProductCard
                key={product.name}
                onClick={() => handleSelect(product)}
                style={{
                  backgroundColor:
                    selectedProduct?.name === product.name ? "#0056b3" : "",
                }}
              >
                <ProductInfo>
                  <ProductImageStyled
                    src={ProductImage[product.name]}
                    alt={product.name}
                  />
                  <CenteredCardDetails>
                    <CenteredCardInfoColumn>
                      <CardTitle>{product.name}</CardTitle>
                      <p>Quantity: {product.quantity}</p>
                    </CenteredCardInfoColumn>
                  </CenteredCardDetails>
                </ProductInfo>
              </ProductCard>
            ))}
        </ScrollableTableContainer>
      ) : (
        <ClickableText onClick={onRedirectToTilkRoad}>
          You have no products. Click here to go to Tilk Road to buy some.
        </ClickableText>
      )}
      <ButtonContainer>
        <NeonButton
          onClick={() =>
            selectedProduct &&
            calculateAmountToShip(shippingMethod, selectedProduct)
          }
          disabled={!selectedProduct}
        >
          Ship Product
        </NeonButton>
      </ButtonContainer>
    </ModalContainer>
  );
};

export default ProductSelectionModal;
