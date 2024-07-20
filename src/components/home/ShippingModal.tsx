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
} from "./styles/supplier.css";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { IMarketInfo, MarketProduct } from "../interfaces/market.interface";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import useShipProduct from "../../hooks/useShipProduct";
import { EShippingUpgrade } from "../interfaces/upgrade.interface";

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
      console.log(batch);
    }
  }

  const handleShip = () => {
    shipProduct("NY", batch, setUserInfo);
  }

  if (!isOpen) return null;

  return (
    <FixedOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Notch />
        <p>Shipping Manifest</p>
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
          <ShoppingCartFooter>
            <ShoppingCartBalance>
              Containers: {batch.length}/{shippingContainers}
            </ShoppingCartBalance>
            <ShoppingCartTotal>
              <Table>
                <tbody>
                  {batch.map((b) => (
                    <tr key={b.product}>
                      <td>{b.product}</td>
                      <td>{b.amountToSell}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ShoppingCartTotal>
            <NeonButton
              onClick={handleShip}
              className="active"
            >
              Ship
            </NeonButton>
          </ShoppingCartFooter>
          </ScrollableTableContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <RoundButton onClick={onClose}>&times;</RoundButton>
      </ModalContainer>
    </FixedOverlay>
  );
};
