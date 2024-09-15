import styled from "styled-components";

export const TilkRoadContainer = styled.div`
  background-color: #1a1a1a;
  color: #e4e4e7;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 80vh; // Adjust this value as needed
`;

export const TilkRoadHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TilkRoadLogo = styled.img`
  max-width: 50px;
  padding: 10px;
`;

export const TilkRoadTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

export const TilkRoadDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

export const ShoppingCartInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const Balance = styled.span`
  font-weight: bold;
`;

export const Total = styled.span`
  font-weight: bold;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

export const ProductCard = styled.div<{ locked: boolean }>`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  border: 2px solid #285d90;
`;

export const ProductTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ProductIcon = styled.div`
  font-size: 1.25rem;
`;

export const Price = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

export const PriceChange = styled.span<{ increase: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.increase ? "#48bb78" : "#f56565")};
`;

export const ProductMiddleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const BuyButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #4b5563;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 50px;
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: #e4e4e7;
  font-size: 0.875rem;
`;

export const QuantitySlider = styled.input`
  width: 100%;
  margin-top: 0.5rem;
`;

export const UnlockButton = styled.button`
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #3b82f6;
    color: white;
  }
`;

export const ScrollableTableContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
  padding-right: 0.5rem;

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

  &::-webkit-scrollbar-thumb:hover {
    background-color: #718096;
  }
`;

export const WebPageTitle = styled.div`
  background-color: white;
  color: black;
  font-size: 0.7rem;
  margin-bottom: 2px;
`;
