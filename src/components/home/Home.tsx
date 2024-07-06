import { useEffect, useLayoutEffect, useState } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { SupplierModal } from "./modals/SupplierModal";
import { ShippingBoard } from "./ShippingBoard";
import {
  FlexBoxCol,
  FlexBoxRow,
  HorizontalSpacing,
} from "../styled/globalStyled";
import userCharacter from "/assets/user_no_background.png";
import WebApp from "@twa-dev/sdk";
import { customerList, marketPrice } from "../../mocks/backend.mock";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { LastTransaction } from "./LastTransaction";
import { TouchPoints } from "../utils/touchPoints";
import styled from "styled-components";
import { Upgrades } from "../shop/utils/types";
import { Product } from "../interfaces/user.interface";

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  transition: transform 0.15s ease-in-out;
  &.pressed {
    transform: scale(0.95);
  }
`;

interface HomeProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onUnlockClick: (tab: keyof Upgrades) => void; // Add this prop
}

export const Home: React.FC<HomeProps> = ({
  cashAmount,
  setCashAmount,
  products,
  setProducts,
  onUnlockClick, // Destructure the new prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<number>(0);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );
  const [isSupplierModalOpen, setIsSupplierModalOpen] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    const scrollableEl = document.getElementById("mainView");
    if (scrollableEl) {
      scrollableEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const value = calculateTotalQuantity(products);
    setTotalQuantity(value);
  }, [products]);

  const handleOpenModal = (slot: number) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleOpenSupplierModal = () => {
    setIsSupplierModalOpen(true);
  };

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  const handleSelectProductFromInventory = (product: {
    id: number;
    name: string;
    quantity: number;
  }) => {
    if (selectedSlot === null) return;

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.name === product.name
          ? { ...p, slot: selectedSlot }
          : p.slot === selectedSlot
          ? { ...p, slot: null }
          : p
      )
    );

    setIsModalOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    const slottedProducts = products.filter((p) => p.slot !== null);

    const order = customerList[currentCustomer];
    setCurrentCustomer(
      (prevCustomer) => (prevCustomer + 1) % customerList.length
    );
    const productName = Object.keys(order)[0];
    const amountToSell = Object.values(order)[0];

    const slottedProductToSell = slottedProducts.find(
      (p) => p.name === productName
    );
    let newTouchPoint = {
      id: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
      amountEarned: 0,
    };
    if (!slottedProductToSell || slottedProductToSell.quantity < amountToSell) {
      console.log(`IN HOME productId ${productName}`);
      setLastTransaction({
        type: "missed",
        product:
          products.find((p) => p.name === productName)?.name || "Unknown",
        quantity: amountToSell,
      });
    } else {
      const { updatedProducts, transaction } = handleTransaction(
        slottedProducts,
        products,
        productName,
        amountToSell,
        marketPrice,
        setCashAmount
      );

      setProducts(updatedProducts);
      setLastTransaction(transaction);

      newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: transaction?.amountEarned || 0,
      };
    }

    setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
    setPressed(true);
    WebApp.HapticFeedback.impactOccurred("heavy");
    setTimeout(() => setPressed(false), 50);
    setTimeout(() => {
      setTouchPoints((prevTouchPoints) =>
        prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
      );
    }, 3000);
  };

  return (
    <>
      <FlexBoxRow className="justify-between items-center bg-zinc-800 text-white px-4 rounded shadow-lg">
        <LastTransaction transaction={lastTransaction} />
      </FlexBoxRow>
      <FlexBoxRow className="justify-between items-center">
        <FlexBoxCol>
          <div className="mb-2">Sell your product 👇</div>
        </FlexBoxCol>
        <FlexBoxCol className="flex justify-end mr-5">
          <button
            className="btn btn-primary mt-4"
            onClick={handleOpenSupplierModal}
          >
            Buy Products
          </button>
        </FlexBoxCol>
      </FlexBoxRow>

      <FlexBoxRow>
        <ImageContainer
          className={pressed ? "pressed" : ""}
          onTouchStart={handleTouchStart}
        >
          <img src={userCharacter} alt="Logo" style={{ maxWidth: "200px" }} />
        </ImageContainer>
        <ShippingBoard products={products} />
      </FlexBoxRow>
      <HorizontalSpacing />
      <HorizontalSpacing />

      {isModalOpen && (
        <InventoryModal
          selectedSlot={selectedSlot}
          productsData={products}
          handleSelectProductFromInventory={handleSelectProductFromInventory}
          handleCloseModal={handleCloseModal}
        />
      )}
      {isSupplierModalOpen && (
        <SupplierModal
          isOpen={isSupplierModalOpen}
          onClose={handleCloseSupplierModal}
          products={products}
          setProducts={setProducts}
          cashAmount={cashAmount}
          setCashAmount={setCashAmount}
          onUnlockClick={onUnlockClick} // Pass the new prop
        />
      )}
      <TouchPoints touchPoints={touchPoints} />
    </>
  );
};
