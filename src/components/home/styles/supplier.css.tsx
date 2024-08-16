import styled from "styled-components";

export const NeonButton = styled.button`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 1px solid #eab308;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, transform 0.1s ease;

  &:hover {
    background-color: rgb(24 24 27);
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &:active {
    animation: glow 1.5s infinite alternate, pulse 2s infinite;
  }

  &.disabled {
    background-color: rgb(99 99 99) !important;
    border: none;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1.4rem;
  right: 1rem;
  background: none;
  border: none;
  color: black;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff0000;
  }
`;

export const Notch = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 20px;
  background-color: #2d3748;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const WebPageTitle = styled.div`
  background-color: white;
  color: black;
  font-size: 0.7rem;
  margin: 5px;
`;

export const RoundButton = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 50%;
  padding: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  box-shadow: 0 0 5px #ea0808, 0 0 10px #ea0808, 0 0 20px #ea0808,
    0 0 30px #ea0808;
  border: 2px solid #ea0808;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);

  &:hover {
    background-color: rgb(24 24 27);
  }
`;

export const FixedOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  border: 1px solid #797979;
  background-color: black;
  font-size: 0.8em;
  padding: 2rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 95%;
  max-width: 400px;
  height: 83%;
  position: relative;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ScrollableTableContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
  background-color: #1a202c;
  margin-bottom: 0.2rem;

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

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

export const Table = styled.table`
  width: 100%;
  background-color: #2d3748;
  border-radius: 0.5rem;
  table-layout: fixed;
  th,
  td {
    padding: 0.9rem;
    text-align: left;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  th {
    padding: 0rem;
    font-size: 0.4rem;
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

    &.max {
      background-color: #63b3ed;

      &:hover {
        background-color: #4299e1;
      }
    }
  }
`;

export const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  transition: background-color 0.3s;

  &.cancel {
    background-color: #718096;

    &:hover {
      background-color: #4a5568;
    }
  }

  &.buy {
    padding: 0.4rem 1rem;

    background-color: #48bb78;

    &:hover {
      background-color: #38a169;
    }
  }

  &.max {
    background-color: #63b3ed;

    &:hover {
      background-color: #4299e1;
    }
  }
`;

export const ShoppingCartFooter = styled.div`
  background-color: #191e2b;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-top: 1px solid #2d3748;
  flex-direction: row;
  align-items: center;
`;

export const ShoppingCartBalance = styled.div`
  color: #cbd5e0;
  font-weight: 600;
  font-size: 1rem;
`;

export const ShoppingCartTotal = styled.div`
  color: #cbd5e0;
  font-weight: 600;
  font-size: 1rem;
`;

export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  width: 100%;
`;
export const SiteTitle = styled.div`
  color: #cbd5e0;
  font-weight: 600;
  font-size: 1.3rem;
`;

export const RightAlignedTd = styled.td`
  text-align: right;
`;

export const Countdown = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #4a5568;
  margin-bottom: 1rem; /* Add some spacing below the tabs */
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#ffffff" : "#1b1a1a")};
  color: ${(props) => (props.active ? "#000000" : "#cbd5e0")};
  border: 1px solid #4a5568;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  flex-grow: 1;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#ffffff" : "#2d2d2d")};
  }

  &:not(:last-child) {
    margin-right: 2px;
  }

  &.active {
    z-index: 2;
  }
`;
export const PriceVariation = styled.span`
  font-size: 0.7em;
  margin-left: 5px;
`;
