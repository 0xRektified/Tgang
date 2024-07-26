import React, { useState } from "react";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { FlexBoxRow, NeonButton } from "./styles/supplier.css";
import {
  ModalContainer,
  CloseButton,
  CardContainer,
  CardHeader,
  CardContent,
  CardTitle,
  CardImage,
  CardDetails,
  CardInfoColumn,
  ScrollableTableContainer,
} from "./styles/shipping.css";

interface ProductSelectionModalProps {
  userInfo: IUserInfo;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  userInfo,
  onClose,
  onSelectProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <ModalContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h3>Select a Product to Ship</h3>
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
                <CardImage src={product.image} alt={product.name} />
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
      <FlexBoxRow>
        <NeonButton
          onClick={() => selectedProduct && onSelectProduct(selectedProduct)}
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
