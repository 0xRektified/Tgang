import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { CustomersBoard } from "./CustomersBoard";
import WebApp from "@twa-dev/sdk";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { IUserInfo, Product } from "../interfaces/user.interface";
import { ClickableAreaWithSmoke } from "./ClickableArea";
import { ICustomerInfo } from "../interfaces/customer.interface";
import { marketId } from "../../mocks/backend.mock";
import useBatchSell from "../../hooks/useBatchSell";
import { IMarketInfo } from "../interfaces/market.interface";

interface HomeProps {
  userInfo: IUserInfo | undefined;
  products: Product[];
  customers: ICustomerInfo[];
  nbrOfUserInBatch: number;
  marketInfo: IMarketInfo | undefined;
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  setCarryAmount: React.Dispatch<React.SetStateAction<number>>;
  fetchCustomers: () => Promise<
    | {
        customers: ICustomerInfo[];
      }
    | undefined
  >;
}

export const Home: React.FC<HomeProps> = ({
  userInfo,
  products,
  customers,
  nbrOfUserInBatch,
  marketInfo,
  setCustomers,
  setProducts,
  fetchCustomers,
  setCashAmount,
  setCarryAmount,
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

  const playSound = (() => {
    let lastPlayTime = 0;
    let concurrentSounds = 0;
    const maxConcurrentSounds = 3;
    const minInterval = 200;

    return () => {
      const now = Date.now();
      if (
        concurrentSounds < maxConcurrentSounds &&
        now - lastPlayTime > minInterval
      ) {
        concurrentSounds++;
        lastPlayTime = now;
        const audio = new Audio("/assets/cash.mp3");
        audio.play();
        audio.onended = () => {
          concurrentSounds--;
        };
      }
    };
  })();

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
          userInfo,
          slottedProducts,
          products,
          product,
          amountToSell,
          marketInfo,
          setCashAmount,
          setCarryAmount
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
      if (newTouchPoint.amountEarned) {
        playSound();
      }
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
