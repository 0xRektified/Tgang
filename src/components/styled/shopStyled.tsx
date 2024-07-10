import styled from "styled-components";

// Styled components
export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #1c1c1e;
  border-radius: 0.375rem;
  width: 100%;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

export const Tab = styled.a<{ active: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#3a3a3c" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#8e8e93")};
  border-radius: 0.375rem;
  &:hover {
    background-color: #3a3a3c;
    color: #fff;
  }
`;

export const UpgradeContainer = styled.div`
  background-color: #1c1c1e;
  width: 100%;
  padding: 1rem;
  overflow-y: scroll;
  height: 40rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

export const UpgradeCard = styled.div<{ locked: boolean }>`
  background-color: #2c2c2e;
  padding: 1rem;
  border-radius: 0.375rem;
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(0.95);
  }
  border: 1px solid #3a3a3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardImage = styled.figure`
  margin: 0;
  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.375rem;
    border: 1px solid #3a3a3c;
  }
`;

export const CardDetails = styled.div`
  text-align: right;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #8e8e93;
`;

export const CardBody = styled.div`
  flex-grow: 1;
  color: #fff;
`;

export const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
`;

export const CardDescription = styled.p`
  color: #8e8e93;
`;

export const ShopContainer = styled.div`
  background-color: #1c1c1e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

// Styled components
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
  z-index: 1000; /* Ensure the overlay is just below the modal */
`;

export const ModalContainer = styled.div`
  background-color: #2d3748;
  padding: 2rem 1rem; /* Adjust padding to make room for the notch */
  border-radius: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px; /* Width similar to an iPhone */
  height: 80%; /* Height similar to an iPhone */
  position: relative; /* Ensure relative positioning within the overlay */
  z-index: 1001; /* Ensure it is above the overlay */
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ScrollableTableContainer = styled.div`
  flex-grow: 1; /* Allow the table to grow and fill available space */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
  border-radius: 1rem;
  background-color: #1a202c;

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

export const Table = styled.table`
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

  .range {
    width: 100%; /* Adjust the width as needed */
    margin: 0.5rem 0;
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

  &.buy {
    background-color: #48bb78;

    &:hover {
      background-color: #38a169;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ffffff;
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
