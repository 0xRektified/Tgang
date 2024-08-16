import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../../hooks/useTonConnect";
import styled from "styled-components";

import { FlexBoxCol, FlexBoxRow } from "../styled/globalStyled";

const AirdropContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 1rem;
`;

export const Card = styled.div`
  padding: 18px 20px;
  border-radius: 8px;
  background-color: #2d3748;
`;

const WalletInfo = styled.div`
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const WalletAddress = styled.div`
  color: white;
  font-family: "Courier New", monospace;
  font-size: 1rem;
  padding: 0.25rem;
  background-color: #2d3748;
  border-radius: 0.375rem;
`;

const AddressLabel = styled.b`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  color: white;
  margin-right: 0.5rem;
`;

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export const Airdrop: React.FC = () => {
  const { connected, wallet } = useTonConnect();

  return (
    <AirdropContainer>
      <Card>
        <FlexBoxCol>
          <WalletInfo>
            Wallet {connected ? "connected" : "Not connected"}
          </WalletInfo>
          {/* <FlexBoxRow>
            <AddressLabel>Address</AddressLabel>
            <WalletAddress>
              {formatAddress(wallet ? wallet : "0x000000000000")}
            </WalletAddress>
          </FlexBoxRow> */}
          <TonConnectButton />
        </FlexBoxCol>
      </Card>
    </AirdropContainer>
  );
};
