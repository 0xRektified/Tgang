import { Product } from "../utils/types";

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

export const InventoryModal: React.FC<InventoryModalProps> = ({
  selectedSlot,
  productsData,
  handleSelectProductFromInventory,
  handleCloseModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-2/3 max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Select Product for Slot {selectedSlot! + 1}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-700 bg-gray-700"></th>
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
                    key={product.id}
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectProductFromInventory(product)}
                  >
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700 text-gray-200">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700 text-gray-200">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-700 text-right">
                      <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleCloseModal}
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
