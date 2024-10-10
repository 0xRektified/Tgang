import styled from "styled-components";
import { Product } from "../../interfaces/user.interface";

interface InventoryModalProps {
  selectedSlot: number | null;
  productsData: Product[];
  handleSelectProductFromInventory: (product: {
    id: number;
    name: string;
    quantity: number;
  }) => void;
  handleCloseModal: () => void;
}

const ScrollableTableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d3748;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 4px;
  }
`;

const ModalContainer = styled.div`
  background-color: #2d3748;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
`;

const Table = styled.table`
  width: 100%;
  background-color: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;

  th,
  td {
    padding: 0.5rem;
    text-align: left;
    font-size: 0.875rem;
  }

  th {
    background-color: #4a5568;
    color: #cbd5e0;
    text-transform: uppercase;
    font-weight: 600;
  }

  tbody tr {
    cursor: pointer;

    &:hover {
      background-color: #4a5568;
    }

    &.disabled {
      background-color: #1a202c;
      cursor: not-allowed;

      &:hover {
        background-color: #1a202c;
      }

      td {
        color: #718096;
      }

      button {
        background-color: #2d3748;
        cursor: not-allowed;

        &:hover {
          background-color: #2d3748;
        }
      }
    }
  }

  button {
    padding: 0.25rem 0.5rem;
    background-color: #3b82f6;
    color: #ffffff;
    border-radius: 0.25rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

// @note Reuse this class when implementing the labs

export const InventoryModal: React.FC<InventoryModalProps> = ({
  selectedSlot,
  productsData,
  handleSelectProductFromInventory,
  handleCloseModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <ModalContainer>
        <h2 className="text-2xl font-bold mb-6 text-white">
          Inventory Slot {selectedSlot! + 1}
        </h2>
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Product</th>
                <th style={{ width: "25%" }}>Quantity</th>
                <th style={{ width: "25%" }}></th>
              </tr>
            </thead>
            <tbody>
              {productsData
                .filter(
                  (product) =>
                    product.slot === null || product.slot === selectedSlot
                )
                .map((product) => (
                  <tr
                    key={product.name}
                    onClick={
                      product.quantity > 0
                        ? undefined //() => handleSelectProductFromInventory(product)
                        : undefined
                    }
                    className={product.quantity === 0 ? "disabled" : ""}
                  >
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td className="text-right">
                      <button disabled={product.quantity === 0}>Select</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ScrollableTableContainer>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleCloseModal}
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </ModalContainer>
    </div>
  );
};
