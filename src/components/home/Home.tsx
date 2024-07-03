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
import {
  productsData,
  customerList,
  marketPrice,
} from "../../mocks/backend.mock";
import { HomeProps, Product, TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { LastTransaction } from "./LastTransaction";
import { TouchPoints } from "../utils/touchPoints";
import styled from "styled-components";

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

export const Home: React.FC<HomeProps> = ({ cashAmount, setCashAmount }) => {
  const [products, setProducts] = useState<Product[]>(productsData);
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
        p.id === product.id
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

    // Filter products that are in a slot
    const slottedProducts = products.filter((p) => p.slot !== null);

    const order = customerList[currentCustomer];
    setCurrentCustomer(
      (prevCustomer) => (prevCustomer + 1) % customerList.length
    );
    const productId = parseInt(Object.keys(order)[0]);
    const amountToSell = Object.values(order)[0];

    const slottedProductToSell = slottedProducts.find(
      (p) => p.id === productId
    );
    let newTouchPoint = {
      id: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
      amountEarned: 0,
    };
    if (!slottedProductToSell || slottedProductToSell.quantity < amountToSell) {
      setLastTransaction({
        type: "missed",
        product: products.find((p) => p.id === productId)?.name || "Unknown",
        quantity: amountToSell,
      });
    } else {
      const { updatedProducts, transaction } = handleTransaction(
        slottedProducts,
        products,
        productId,
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
        <ShippingBoard
          products={products}
          handleOpenModal={handleOpenModal}
          totalQuantity={totalQuantity}
        />
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
        />
      )}
      <TouchPoints touchPoints={touchPoints} />
    </>
  );
};
