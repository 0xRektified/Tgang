import styled from "styled-components";

export const TilkRoadContainer = styled.div`
  background-color: #1a1a1a;
  color: #e4e4e7;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 70vh;
`;

export const TilkRoadHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

export const TilkRoadLogo = styled.img`
  max-width: 50px;
  padding: 10px;
`;

export const TilkRoadTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

export const TilkRoadDescription = styled.p`
  font-size: 0.7rem;
  margin: 0;
`;

export const ShoppingCartInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Balance = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

export const Total = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-bottom: 10rem;
  gap: 1rem;
`;

export const ProductCard = styled.div<{ locked: boolean }>`
  background: linear-gradient(135deg, #282c34, #3c3f45);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  border: 2px solid #285d90;
`;

export const ProductTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

export const ProductIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProductIcon = styled.div`
  font-size: 1.2rem;
`;

export const Price = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
`;

export const PriceChange = styled.span<{ increase: boolean }>`
  font-size: 0.8rem;
  color: ${(props) => (props.increase ? "#48bb78" : "#f56565")};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    font-size: 0.7rem;
  }
`;

export const ProductControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const BuyControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const BuyButton = styled.button`
  width: 50%;
  padding-left: 8px;
  padding-right: 8px;
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.3rem;
  border: 2px solid #1e90ff;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff, 0 0 8px #1e90ff;
  animation: glow 1.5s infinite alternate;

  @keyframes glow {
    0% {
      box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff, 0 0 6px #1e90ff,
        0 0 8px #1e90ff;
    }
    100% {
      box-shadow: 0 0 8px #1e90ff, 0 0 12px #1e90ff, 0 0 16px #1e90ff,
        0 0 20px #1e90ff;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  &:disabled {
    background-color: rgb(99 99 99);
    color: rgb(150 150 150);
    box-shadow: none;
    border: none;
    cursor: not-allowed;
    animation: none;
  }
`;

export const QuantityInput = styled.input`
  width: 5em;
  text-align: right;
  padding: 0.3rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: #e4e4e7;
  font-size: 0.8rem;
`;

export const QuantitySlider = styled.input`
  width: 100%;
  margin-top: 0.5rem;
`;

export const UnlockButton = styled(BuyButton)`
  background-color: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  width: 100%;
  margin-top: 1.5em;
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
