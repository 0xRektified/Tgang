import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { CustomersBoard } from "./CustomersBoard";
import WebApp from "@twa-dev/sdk";
import { marketPrice } from "../../mocks/backend.mock";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { Product } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { ICustomerInfo } from "../interfaces/customer.interface";
import { marketId } from "../../mocks/backend.mock";
import useBatchSell from "../../hooks/useBatchSell";
import styled from "styled-components";

interface HomeProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  carryAmount: number;
  setCarryAmount: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  customers: ICustomerInfo[];
  nbrOfUserInBatch: number;
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  fetchCustomers: () => Promise<
    | {
        customers: ICustomerInfo[];
      }
    | undefined
  >;
}

export const Home: React.FC<HomeProps> = ({
  cashAmount,
  setCashAmount,
  carryAmount,
  setCarryAmount,
  products,
  customers,
  nbrOfUserInBatch,
  setCustomers,
  setProducts,
  fetchCustomers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const audioRef = useRef(new Audio("/assets/cash.mp3"));

  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );
  const { addToBatch, loading, error } = useBatchSell(
    marketId,
    nbrOfUserInBatch,
    customers,
    setCashAmount,
    setCarryAmount,
    setProducts,
    fetchCustomers
  );
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
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

  const playSound = () => {
    const audio = new Audio("/assets/cash.mp3");
    audio.play();
  };

  const handleTouchStart = async (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    const slottedProducts = products.filter((p) => p.slot !== null);

    if (customers && customers.length > 0) {
      const order = customers[0];
      const { product, quantity: amountToSell } = order;

      const slottedProductToSell = slottedProducts.find(
        (p) => p.name === product
      );

      let newTouchPoint = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
        amountEarned: 0,
      };

      if (
        !slottedProductToSell ||
        slottedProductToSell.quantity < amountToSell
      ) {
        setLastTransaction({
          type: "missed",
          product: product || "Unknown",
          quantity: amountToSell,
        });
      } else {
        const { updatedProducts, transaction } = handleTransaction(
          slottedProducts,
          products,
          product,
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

        addToBatch(order.customerIndex);
      }

      const updatedCustomerList = [...customers];
      updatedCustomerList.splice(0, 1);

      setCustomers(updatedCustomerList);

      setTouchPoints((prevTouchPoints) => [...prevTouchPoints, newTouchPoint]);
      setPressed(true);

      //@note disabled sound for now it seems to be creating a lag
      // if (newTouchPoint.amountEarned) {
      //   playSound();
      // }
      WebApp.HapticFeedback.impactOccurred("heavy");
      setTimeout(() => setPressed(false), 50);
      setTimeout(() => {
        setTouchPoints((prevTouchPoints) =>
          prevTouchPoints.filter((point) => point.id !== newTouchPoint.id)
        );
      }, 3000);
    }
  };

  return (
    <>
      <ClickableAreaWithSmoke
        products={products}
        handleTouchStart={handleTouchStart}
        pressed={pressed}
      />
      <div className="bg-zinc-800 text-white px-4 rounded shadow-lg">
        <CustomersBoard
          products={products}
          customers={customers}
          transaction={lastTransaction}
          waitingCustomersCount={customers.length}
        />
      </div>
      <TouchPoints touchPoints={touchPoints} />
      {isModalOpen && (
        <InventoryModal
          selectedSlot={selectedSlot}
          productsData={products}
          handleSelectProductFromInventory={handleSelectProductFromInventory}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};
