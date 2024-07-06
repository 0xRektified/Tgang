import { FlexBoxCol, FlexBoxRow } from "../styled/globalStyled";
import { Product } from "./utils/types";
import { GiAvoidance } from "react-icons/gi";
interface ShippingBoardProps {
  products: Product[];
  handleOpenModal: (slot: number) => void;
  totalQuantity: number;
}

export const ShippingBoard: React.FC<ShippingBoardProps> = ({
  products,
  handleOpenModal,
  totalQuantity,
}) => {
  const maxShipping = 500;
  const slots = [0, 1, 2]; // Define slots

  return (
    <FlexBoxCol className="w-full">
      {slots.map((slot) => {
        const product = products.find((p) => p.slot === slot);
        return (
          <FlexBoxRow key={slot} className="w-full">
            {product ? (
              <div className="w-full" onClick={() => handleOpenModal(slot)}>
                <FlexBoxRow key={slot} className="w-full">
                  <div className="mb-2">
                    {product.name} {product.quantity}/{product.maxCarry}
                  </div>
                  <div className="pl-5 mb-2">
                    <GiAvoidance />
                  </div>
                </FlexBoxRow>
                <progress
                  className="progress progress-primary w-full"
                  value={product.quantity}
                  max={500}
                ></progress>
              </div>
            ) : products.find((p) => p.slot === null) ? (
              <button
                onClick={() => handleOpenModal(slot)}
                className="btn btn-primary w-full"
              >
                Add Product
              </button>
            ) : (
              <button disabled className="btn btn-disabled w-full">
                Locked
              </button>
            )}
          </FlexBoxRow>
        );
      })}
    </FlexBoxCol>
  );
};
