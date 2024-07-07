import { useEffect, useLayoutEffect, useState } from "react";
import { InventoryModal } from "./modals/InventoryModal";
import { CustomersBoard } from "./CustomersBoard";
import WebApp from "@twa-dev/sdk";
import { marketPrice } from "../../mocks/backend.mock";
import { TouchPoint, Transaction } from "./utils/types";
import { calculateTotalQuantity, handleTransaction } from "./utils/functions";
import { TouchPoints } from "../utils/touchPoints";
import { Product } from "../interfaces/user.interface";
import { ProductName } from "../../hooks/useFetchCustomer";
import { ClickableAreaWithSmoke } from "./ClickableArea";

interface HomeProps {
  cashAmount: number;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const Home: React.FC<HomeProps> = ({
  cashAmount,
  setCashAmount,
  products,
  customers,
  setCustomers,
  setProducts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [pressed, setPressed] = useState(false);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);

  const [customerServed, setCustomerServed] = useState<any[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    const slottedProducts = products.filter((p) => p.slot !== null);

    if (customers && customers.length > 0) {
      const order = customers[0];
      const productName = Object.keys(order)[0] as ProductName;
      const { quantity: amountToSell } = order[productName];

      const slottedProductToSell = slottedProducts.find(
        (p) => p.name === productName
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

        setCustomerServed([...customerServed, customers[0]]);
        const updatedCustomerList = [...customers];
        updatedCustomerList.splice(0, 1);
        console.log(`updatedCustomerList`);
        console.log(updatedCustomerList);
        setCustomers(updatedCustomerList);
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
