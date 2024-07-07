import styled from "styled-components";

export const ModalContainer = styled.div`
  background-color: #2d3748;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
  position: relative; /* Ensure relative positioning within the overlay */
  z-index: 1001; /* Ensure it is above the overlay */
`;

export const ScrollableTableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;

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
    margin-right: 0.5rem;

    &:hover {
      background-color: #4a5568;
    }
  }

  &.buy {
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

export const BottomSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #1a202c;
  border-radius: 0.5rem;
`;

export const QuantityInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #cbd5e0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #63b3ed;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
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
