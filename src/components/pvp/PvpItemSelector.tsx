import React from "react";
import styled from "styled-components";
import { CRAFTABLE_ITEMS, ECRAFTABLE_ITEM } from "../interfaces/craftableItem.interface";

const ItemButton = styled.button<{ isSelected: boolean }>`
  // Add your styles here
`;

interface ItemSelectorProps {
  userItems: { itemId: ECRAFTABLE_ITEM; quantity: number }[];
  selectedItem: ECRAFTABLE_ITEM | null;
  onSelectItem: (item: ECRAFTABLE_ITEM | null) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ userItems, selectedItem, onSelectItem }) => {
  return (
    <div className="flex justify-center space-x-2 my-4">
      {userItems.map((item) => (
        <ItemButton
          key={item.itemId}
          isSelected={selectedItem === item.itemId}
          onClick={() => onSelectItem(selectedItem === item.itemId ? null : item.itemId)}
          disabled={item.quantity === 0}
        >
          {CRAFTABLE_ITEMS[item.itemId].name} ({item.quantity})
        </ItemButton>
      ))}
    </div>
  );
};

export default ItemSelector;