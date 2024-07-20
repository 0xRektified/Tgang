import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import {
  CloseButton,
  FixedOverlay,
  ModalContainer,
  Notch,
  ScrollableTableContainer,
  Table,
  RoundButton,
  NeonButton,
  ShoppingCartBalance,
  ShoppingCartFooter,
  ShoppingCartTotal,
  FlexBoxRow,
  SiteTitle,
} from "./styles/supplier.css";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo } from "../interfaces/market.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import useShipProduct from "../../hooks/useShipProduct";
import { EShippingUpgrade } from "../interfaces/upgrade.interface";
import { formatDuration } from "date-fns";
import styled from "styled-components";

const RightAlignedTd = styled.td`
  text-align: right;
`;

interface ShippingModalProps {
  userInfo: IUserInfo;
  marketInfo: IMarketInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUnlockClick: (tab: string) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const ShippingModal: React.FC<ShippingModalProps> = ({
  userInfo,
  marketInfo,
  isOpen,
  onClose,
  onUnlockClick,
  setUserInfo,
}) => {
  const { shipProduct } = useShipProduct();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingTime, setShippingTime] = useState<number>(0);
  const [shippingContainers, setShippingContainers] = useState<number>(0);
  const [batch, setBatch] = useState<{ product: EProduct; amountToSell: number }[]>([]);

  useEffect(() => {
    const shippingTime = userInfo.shippingUpgrades.find((s) => s.product === EShippingUpgrade.SHIPPING_TIME);
    const containerCount = userInfo.shippingUpgrades.find((s) => s.product === EShippingUpgrade.SHIPPING_CONTAINERS);

    setShippingTime(shippingTime?.amount || 24 * 3600);
    setShippingContainers(containerCount?.amount || 0);
  });

  const getMaxQuantity = (product: Product) => {
    return Math.min(product.quantity, 10000);
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct((prevSelectedProduct) =>
      prevSelectedProduct?.name === product.name ? null : product
    );
    setQuantity(getMaxQuantity(product));
  };

  const pushToBatch = () => {
    if (selectedProduct) {
      if (batch.length > shippingContainers) {
        console.log("Too many products in batch");
        return;
      }

      setBatch((prevBatch) => {
        const newBatch = prevBatch.filter((b) => b.product !== selectedProduct.name);
        newBatch.push({ product: selectedProduct.name, amountToSell: quantity });
        return newBatch;
      });
    }
  }

  const handleShip = () => {
    shipProduct("NY", batch, setUserInfo);
  }

  const duration = () => {
    const hours = Math.floor(shippingTime / 3600);
    const minutes = Math.floor((shippingTime % 3600) / 60);
    return formatDuration({
      hours,
      minutes,
    });
  }

  if (!isOpen) return null;

  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Notch />
        <FlexBoxRow>
          <SiteTitle>Shipping Manifest</SiteTitle>
        </FlexBoxRow>
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <th style={{ width: "35%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "25%" }}></th>
              </tr>
            </thead>
            <tbody>
              {userInfo?.products.map((product) => {
                const productIcon =
                  (product.name as keyof typeof EProductIcon) &&
                  EProductIcon[product.name as keyof typeof EProductIcon];

                return (
                  <React.Fragment key={product.name}>
                    <tr onClick={() => handleProductSelect(product)}>
                      <td>
                        {product.name + ` `}
                        {productIcon}
                      </td>
                      <td className="text-right">{product.quantity}</td>
                      <td className="text-right">
                        {selectedProduct?.name === product.name ? (
                          <NeonButton
                            onClick={pushToBatch}
                            className="active"
                          >
                            Fill
                          </NeonButton>
                        ) : (
                          <NeonButton className="disabled">
                            Fill
                          </NeonButton>
                        )}
                      </td>
                    </tr>
                    {selectedProduct?.name === product.name && (
                      <tr key={product.name + "_details"}>
                        <td colSpan={5}>
                          <div className="flex items-center justify-between">
                            <input
                              type="range"
                              min={0}
                              max={Math.min(selectedProduct.quantity, 10000)}
                              value={quantity}
                              className="range"
                              onChange={(e) => {
                                setQuantity(Number(e.target.value));
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
          </ScrollableTableContainer>
          <FlexBoxRow>
            <ShoppingCartBalance>
              Containers: {batch.length}/{shippingContainers}
            </ShoppingCartBalance>
          </FlexBoxRow>
          <FlexBoxRow>
            <ShoppingCartTotal>
              Shipping Time: {duration()}
            </ShoppingCartTotal>
          </FlexBoxRow>

          <Table>
            <thead>
              <tr>
                <th style={{ width: "50%" }}></th>
                <th style={{ width: "50%" }}></th>
              </tr>
            </thead>
            <tbody>
              {batch.map((b) => (
                <tr key={b.product}>
                  <td>{b.product}</td>
                  <RightAlignedTd>{b.amountToSell}</RightAlignedTd>
                </tr>
              ))}
            </tbody>
          </Table>
          <FlexBoxRow >
            <NeonButton
              onClick={handleShip}
              className="active"
            >
              Ship
            </NeonButton>
          </FlexBoxRow>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <RoundButton onClick={onClose}>&times;</RoundButton>
      </ModalContainer>
    </FixedOverlay>
  );
};
