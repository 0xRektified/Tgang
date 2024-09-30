import React, { useState } from "react";
import styled from "styled-components";
import {
  ECRAFTABLE_ITEM,
  CRAFTABLE_ITEMS,
} from "../interfaces/craftableItem.interface";
import { IUserInfo } from "../interfaces/user.interface";
import { useCraftItem } from "../../hooks/useCraftItem";

const CraftingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const CraftingItem = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#4a4a4c" : "#3a3a3c")};
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  height: 150px;

  &:hover {
    background-color: #4a4a4c;
  }
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ItemContent = styled.div`
  display: flex;
  flex-grow: 1;
`;

const ItemImageContainer = styled.div`
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ItemImage = styled.img`
  width: 40px;
  height: 40px;
  margin-top: 30px;
  object-fit: contain;
`;

const ItemRequirements = styled.div`
  font-size: 0.6rem;
  color: #a0a0a0;
  text-align: center;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.7rem;
  color: #a0a0a0;
  padding-left: 0.5rem;
`;

const ItemEffect = styled.div`
  margin-bottom: 0.25rem;
`;

const ItemDuration = styled.div``;

const CraftingDetails = styled.div`
  margin-top: 1rem;
  background-color: #3a3a3c;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const RequirementsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RequirementItem = styled.li`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const QuantityButton = styled.button`
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #4a4a4c;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  color: #ffffff;
  font-size: 1rem;
  margin: 0 0.5rem;
`;

const CraftButton = styled.button`
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #4a4a4c;
    cursor: not-allowed;
  }
`;

interface CraftingStationProps {
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

export const CraftingStation: React.FC<CraftingStationProps> = ({
  userInfo,
  setUserInfo,
}) => {
  const [selectedItem, setSelectedItem] = useState<ECRAFTABLE_ITEM | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const { craftItem, loading, error, successMessage } = useCraftItem();

  const handleItemSelect = (itemId: ECRAFTABLE_ITEM) => {
    setSelectedItem(itemId);
    setQuantity(1);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleCraft = async () => {
    if (selectedItem) {
      try {
        const updatedUser = await craftItem(selectedItem, quantity);
        setUserInfo(updatedUser);
      } catch (err) {
        console.error("Failed to craft item:", err);
      }
    }
  };

  const canCraft = () => {
    if (!selectedItem) return false;
    const item = CRAFTABLE_ITEMS[selectedItem];
    return Object.entries(item.requirements).every(([product, amount]) => {
      const userProduct = userInfo.products.find((p) => p.name === product);
      return userProduct && userProduct.quantity >= amount * quantity;
    });
  };

  const renderRequirements = (
    item: (typeof CRAFTABLE_ITEMS)[ECRAFTABLE_ITEM],
  ) => {
    return Object.entries(item.requirements)
      .map(([product, amount]) => `${product}: ${amount}`)
      .join("\n");
  };

  const renderEffectText = (
    item: (typeof CRAFTABLE_ITEMS)[ECRAFTABLE_ITEM],
  ) => {
    return Object.entries(item.pvpEffect)
      .map(([key, value]) => `${key}: +${value}`)
      .join("\n");
  };

  return (
    <>
      <CraftingGrid>
        {Object.entries(CRAFTABLE_ITEMS).map(([itemId, item]) => (
          <CraftingItem
            key={itemId}
            onClick={() => handleItemSelect(itemId as ECRAFTABLE_ITEM)}
            selected={selectedItem === itemId}
          >
            <ItemName>{item.name}</ItemName>
            <ItemContent>
              <ItemImageContainer>
                <ItemImage src={item.image} alt={item.name} />
                {/* <ItemRequirements>{renderRequirements(item)}</ItemRequirements> */}
              </ItemImageContainer>
              <ItemDetails>
                <ItemEffect>{renderEffectText(item)}</ItemEffect>
                <ItemDuration>Duration: {item.duration} rounds</ItemDuration>
              </ItemDetails>
            </ItemContent>
          </CraftingItem>
        ))}
      </CraftingGrid>
      {selectedItem && (
        <CraftingDetails>
          <h3>{CRAFTABLE_ITEMS[selectedItem].name}</h3>
          <RequirementsList>
            {Object.entries(CRAFTABLE_ITEMS[selectedItem].requirements).map(
              ([product, amount]) => (
                <RequirementItem key={product}>
                  {product}: {amount * quantity} (You have:{" "}
                  {userInfo.products.find((p) => p.name === product)
                    ?.quantity || 0}
                  )
                </RequirementItem>
              ),
            )}
          </RequirementsList>
          <QuantityControl>
            <QuantityButton
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              +
            </QuantityButton>
          </QuantityControl>
          <CraftButton onClick={handleCraft} disabled={!canCraft() || loading}>
            {loading ? "Crafting..." : "Craft"}
          </CraftButton>
        </CraftingDetails>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </>
  );
};
