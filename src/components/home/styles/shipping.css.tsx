import styled from "styled-components";

export const CardContainer = styled.div<{ locked?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: rgba(128, 128, 128, 0.15);
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
  color: #e4e4e7;
  margin-bottom: 1rem;
  align-items: center;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardContent = styled.div`
  margin-top: 1rem;
`;

export const CardTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

export const CardImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 0.8rem;
`;

export const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

export const CardInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CardRequirement = styled.p`
  font-size: 0.8rem;
  color: #ff6b6b;
`;

export const NeonButtonShipping = styled.button`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 1rem 0rem;
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

export const NeonButtonShippingLocked = styled.button`
  background-color: rgb(39 39 42) !important;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 1rem;
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

export const Button = styled.button`
  background-color: rgb(39 39 42);
  color: #e4e4e7;
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
  border: 0.2rem solid;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(24 24 27);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ShippingCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1.4rem;
  right: 1rem;
  background: none;
  border: none;
  color: #e4e4e7;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff0000;
  }
`;

export const ScrollableTableContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
  background-color: #1a202c;
  width: 100%;
  max-height: 60vh; /* Adjust this value as needed */

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

export const ClickableText = styled.div`
  color: #007bff;
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  margin: 1rem 0;

  &:hover {
    color: #0056b3;
  }
`;

export const SiteTitleTedex = styled.h1`
  font-family: "Futura", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  margin: 0;
  padding: 0;

  .te {
    color: #4d148c; /* FedEx Purple for "Te" */
  }

  .dex {
    color: #ff6600; /* FedEx Orange for "dex" */
  }
`;
export const SiteDescription = styled.p`
  font-size: 0.8rem;
  line-height: 1.5;
  color: #cbd5e0;
`;

export const StyledLink = styled.p`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.8rem;
  color: #1e90ff;
  text-shadow: "0 0 8px #1e90ff";
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease, text-decoration 0.3s ease;
`;
