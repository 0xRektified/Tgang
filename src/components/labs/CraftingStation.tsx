import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ECRAFTABLE_ITEM,
  CRAFTABLE_ITEMS,
} from "../interfaces/craftableItem.interface";
import { IUserInfo } from "../interfaces/user.interface";
import { useCraftItem } from "../../hooks/useCraftItem";
import { ApiToast } from "../ApiToast";
import { FaPlus, FaMinus } from "react-icons/fa";
import WebApp from "@twa-dev/sdk";

import { motion, AnimatePresence } from "framer-motion";

const CraftingContainer = styled.div`
  background-color: #1c1c1e;
  border-radius: 0.5rem;
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
  color: white;
  margin-bottom: 0.25rem;
  
  strong {
    font-weight: bold;
  }
`;

const ItemDuration = styled.div`
  color: #4ade80;
`;

const CraftingDetails = styled.div`
  background-color: #2c2c2e;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  scroll-margin-top: 1rem; // This ensures the scroll doesn't cut off the top of the component
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

const CraftedItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
`;

const CraftedItemBox = styled.div`
  border-radius: 0.375rem;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  flex: 0 0 calc(20% - 1rem);
`;

const FlexBoxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CraftedItemIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
`;

const CraftedItemQuantity = styled.span`
  color: #ffffff;
  font-size: 0.9rem;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85); // Increased opacity
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: #2c2c2e;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center; // Center the content horizontally
`;

const ModalIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  object-fit: contain; // Ensure the image maintains its aspect ratio
`;

const ModalText = styled.p`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ModalQuantity = styled.p`
  color: #4ade80;
  font-size: 1.5rem;
  font-weight: bold;
`;

const CraftingTitle = styled.h2`
  color: white;
  font-size: 0.7rem;
  text-align: center;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  const [showModal, setShowModal] = useState(false);
  const [craftedItemInfo, setCraftedItemInfo] = useState<{
    name: string;
    quantity: number;
    image: string;
  } | null>(null);
  const craftingDetailsRef = useRef<HTMLDivElement>(null);

  const handleItemSelect = (itemId: ECRAFTABLE_ITEM) => {
    WebApp.HapticFeedback.impactOccurred("heavy");

    setSelectedItem(itemId);
    setQuantity(1);
    setTimeout(() => {
      craftingDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleQuantityChange = (change: number) => {
    WebApp.HapticFeedback.impactOccurred("heavy");

    setQuantity(Math.max(1, quantity + change));
  };

  const handleCraft = async () => {
    if (selectedItem) {
      WebApp.HapticFeedback.impactOccurred("heavy");

      try {
        const success = await craftItem(selectedItem, quantity, setUserInfo);
        if (success) {
          setCraftedItemInfo({
            name: CRAFTABLE_ITEMS[selectedItem].name,
            quantity: quantity,
            image: CRAFTABLE_ITEMS[selectedItem].image,
          });
          setShowModal(true);
          setTimeout(() => setShowModal(false), 1000);
        }
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

  const renderEffectText = (
    item: (typeof CRAFTABLE_ITEMS)[ECRAFTABLE_ITEM],
  ) => {
    WebApp.HapticFeedback.impactOccurred("heavy");

    return Object.entries(item.pvpEffect)
      .map(([key, value]) => `${key}: <strong>+${value}</strong>`)
      .join("<br>");
  };

  const getCraftedItemQuantity = (itemId: ECRAFTABLE_ITEM) => {
    if (!userInfo.craftedItems) return 0;
    const item = userInfo.craftedItems.find((item) => item.itemId === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CraftingContainer className="scrollable-content">
      <CraftingTitle>Craft special items to boost your PvP stats</CraftingTitle>
      <CraftedItemsContainer>
        {Object.entries(CRAFTABLE_ITEMS).map(([itemId, item]) => (
          <CraftedItemBox key={itemId}>
            <FlexBoxRow>
              <CraftedItemIcon src={item.image} alt={item.name} />
              <CraftedItemQuantity>
                {getCraftedItemQuantity(itemId as ECRAFTABLE_ITEM)}
              </CraftedItemQuantity>
            </FlexBoxRow>
          </CraftedItemBox>
        ))}
      </CraftedItemsContainer>

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
              <ItemEffect dangerouslySetInnerHTML={{ __html: renderEffectText(item) }} />
              <ItemDuration>Duration: {item.duration} rounds</ItemDuration>
            </ItemDetails>
          </CraftingItem>
        ))}
      </CraftingGrid>
      {selectedItem && (
        <CraftingDetails ref={craftingDetailsRef}>
          <h3>{CRAFTABLE_ITEMS[selectedItem].name}</h3>
          <RequirementsList>
            {Object.entries(CRAFTABLE_ITEMS[selectedItem].requirements).map(
              ([product, amount]) => (
                <RequirementItem key={product}>
                  <span>{product}:</span>
                  <span>
                    {amount * quantity} /{" "}
                    {userInfo.products.find((p) => p.name === product)
                      ?.quantity || 0}
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
              {loading
                ? "Crafting..."
                : `Craft ${CRAFTABLE_ITEMS[selectedItem].name}`}
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
      <ApiToast loading={loading} error={error} successMessage={null} />
      <AnimatePresence>
        {showModal && craftedItemInfo && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalIcon
                src={craftedItemInfo.image}
                alt={craftedItemInfo.name}
              />
              <ModalText>Successfully crafted</ModalText>
              <ModalText>{craftedItemInfo.name}</ModalText>
              <ModalQuantity>x{craftedItemInfo.quantity}</ModalQuantity>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </CraftingContainer>
  );
};
