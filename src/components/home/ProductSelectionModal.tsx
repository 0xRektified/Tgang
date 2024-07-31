import React, { useState } from "react";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { FlexBoxRow, NeonButton } from "./styles/supplier.css";
import {
  ModalContainer,
  CloseButton,
  CardContainer,
  CardHeader,
  CardTitle,
  CardImage,
  CardDetails,
  CardInfoColumn,
  ScrollableTableContainer,
  ClickableText,
} from "./styles/shipping.css";
import { EShippingMethod } from "../interfaces/shipping.interface";
import { EProduct, ProductImage } from "../interfaces/product.interface";

interface ProductSelectionModalProps {
  userInfo: IUserInfo;
  onClose: () => void;
  shippingMethod: EShippingMethod;
  amount: number;
  handleShip: (
    shippingMethod: EShippingMethod,
    product: EProduct,
    amount: number
  ) => void;
  onRedirectToTilkRoad: () => void; // Add this prop for redirection
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  userInfo,
  onClose,
  shippingMethod,
  amount,
  handleShip,
  onRedirectToTilkRoad, // Destructure the new prop
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const userHasProducts = userInfo.products.some(
    (product) => product.quantity > 0
  );

  const calculateAmountToShip = async (
    shippingMethod: EShippingMethod,
    selectedProduct: Product
  ) => {
    await handleShip(
      shippingMethod,
      selectedProduct.name,
      Math.min(selectedProduct.quantity, amount)
    );
    onClose();
  };

  return (
    <ModalContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h3>Select a Product to Ship</h3>
      {userHasProducts ? (
        <ScrollableTableContainer>
          {userInfo.products
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <CardContainer
                key={product.name}
                onClick={() => handleSelect(product)}
                style={{
                  backgroundColor:
                    selectedProduct?.name === product.name ? "#0056b3" : "",
                }}
              >
                <CardHeader>
                  <CardImage src={ProductImage[product.name]} alt={product.name} />
                  <CardDetails>
                    <CardInfoColumn>
                      <CardTitle>{product.name}</CardTitle>
                      <p>Quantity: {product.quantity}</p>
                    </CardInfoColumn>
                  </CardDetails>
                </CardHeader>
              </CardContainer>
            ))}
        </ScrollableTableContainer>
      ) : (
        <ClickableText onClick={onRedirectToTilkRoad}>
          You have no products. Click here to go to Tilk Road to buy some.
        </ClickableText>
      )}
      <FlexBoxRow>
        <NeonButton
          onClick={() =>
            selectedProduct &&
            calculateAmountToShip(shippingMethod, selectedProduct)
          }
          className={selectedProduct ? "active" : "disabled"}
          disabled={!selectedProduct}
        >
          Ship Product
        </NeonButton>
      </FlexBoxRow>
    </ModalContainer>
  );
};

export default ProductSelectionModal;
