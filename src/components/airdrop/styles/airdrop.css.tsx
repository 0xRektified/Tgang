import styled, { createGlobalStyle } from "styled-components";

export const AirdropContainer = styled.div`
  background-color: #1c1c1e;
  height: calc(100vh - 120px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  touch-action: none;
`;
export const Card = styled.div`
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Button = styled.button`
  background-color: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem;

  &:hover {
    background-color: #15803d;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #4a4a4a;
  margin: 0 0.5rem;
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-left: 0.5rem;
`;

export const StatDesc = styled.div`
  font-size: 1rem;
  color: white;
`;

export const GreenText = styled.span`
  color: #16a34a;
  font-weight: bold;
`;

export const Countdown = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

export const TableContainer = styled.div`
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #4a4a4a;
    color: white;
  }

  th {
    background-color: #2a2a2e;
  }
`;

export const GreenDot = styled.span`
  height: 1rem;
  width: 1rem;
  background-color: #16a34a;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.5rem;
`;

export const RedDot = styled.span`
  height: 1rem;
  width: 1rem;
  background-color: #dc2626;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.5rem;
`;

export const ItalicText = styled.div`
  font-size: 0.8rem;
  font-style: italic;
  color: #9ca3af;
  text-align: right;
  margin-top: 0.5rem;
  width: 100%;
`;

export const CardWallet = styled.div`
  padding: 18px 20px;
  border-radius: 8px;
  background-color: #2d3748;
`;

export const WalletInfo = styled.div`
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
`;
