import React, { useState } from "react";
import styled from "styled-components";
import {
  ECRAFTABLE_ITEM,
  CRAFTABLE_ITEMS,
} from "../interfaces/craftableItem.interface";
import { IUserInfo } from "../interfaces/user.interface";
import { useCraftItem } from "../../hooks/useCraftItem";
import { ApiToast } from "../ApiToast";
import { FaPlus, FaMinus } from "react-icons/fa";

const CraftingContainer = styled.div`
  background-color: #1c1c1e;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CraftingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CraftingItem = styled.div<{ selected: boolean }>`
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #3a3a3c, #2c2c2e)"
      : "linear-gradient(135deg, #2c2c2e, #1c1c1e)"};
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 180px;
  border: 2px solid ${(props) => (props.selected ? "#1e90ff" : "transparent")};
  box-shadow: ${(props) =>
    props.selected ? "0 0 10px rgba(30, 144, 255, 0.5)" : "none"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin: 0 auto;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #a0a0a0;
  margin-top: 0.5rem;
`;

const ItemEffect = styled.div`
  margin-bottom: 0.25rem;
`;

const ItemDuration = styled.div`
  color: #4ade80;
`;

const CraftingDetails = styled.div`
  background-color: #2c2c2e;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const RequirementsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 1rem;
`;

const RequirementItem = styled.li`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const QuantityButton = styled.button`
  background-color: #3a3a3c;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #4a4a4c;
  }

  &:disabled {
    background-color: #2c2c2e;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0 1rem;
  min-width: 30px;
  text-align: center;
`;

const CraftButton = styled.button`
  background-color: #1e90ff;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #1a7ae0;
    box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
  }

  &:disabled {
    background-color: #4a4a4c;
    cursor: not-allowed;
  }
`;

const NotEnoughResourcesBox = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const MissingResourcesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0.5rem 0 0;
`;

const MissingResourceItem = styled.li`
  color: #ff9999;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
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
        await craftItem(selectedItem, quantity, setUserInfo);
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

  const getMissingResources = () => {
    if (!selectedItem) return [];
    const item = CRAFTABLE_ITEMS[selectedItem];
    return Object.entries(item.requirements)
      .filter(([product, amount]) => {
        const userProduct = userInfo.products.find((p) => p.name === product);
        return !userProduct || userProduct.quantity < amount * quantity;
      })
      .map(([product, amount]) => {
        const userProduct = userInfo.products.find((p) => p.name === product);
        const missingAmount = amount * quantity - (userProduct?.quantity || 0);
        return `${product}: ${missingAmount}`;
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
    <CraftingContainer className="scrollable-content">
      <CraftingGrid>
        {Object.entries(CRAFTABLE_ITEMS).map(([itemId, item]) => (
          <CraftingItem
            key={itemId}
            onClick={() => handleItemSelect(itemId as ECRAFTABLE_ITEM)}
            selected={selectedItem === itemId}
          >
            <ItemName>{item.name}</ItemName>
            <ItemImage src={item.image} alt={item.name} />
            <ItemDetails>
              <ItemEffect>{renderEffectText(item)}</ItemEffect>
              <ItemDuration>Duration: {item.duration} rounds</ItemDuration>
            </ItemDetails>
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
                  <span>{product}:</span>
                  <span>
                    {amount * quantity} / {userInfo.products.find((p) => p.name === product)?.quantity || 0}
                  </span>
                </RequirementItem>
              ),
            )}
          </RequirementsList>
          <QuantityControl>
            <QuantityButton
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <FaMinus />
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              <FaPlus />
            </QuantityButton>
          </QuantityControl>
          {canCraft() ? (
            <CraftButton onClick={handleCraft} disabled={loading}>
              {loading ? "Crafting..." : `Craft ${CRAFTABLE_ITEMS[selectedItem].name}`}
            </CraftButton>
          ) : (
            <NotEnoughResourcesBox>
              Not enough resources to craft
              <MissingResourcesList>
                {getMissingResources().map((resource, index) => (
                  <MissingResourceItem key={index}>
                    {resource}
                  </MissingResourceItem>
                ))}
              </MissingResourcesList>
            </NotEnoughResourcesBox>
          )}
        </CraftingDetails>
      )}
      <ApiToast
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </CraftingContainer>
  );
};