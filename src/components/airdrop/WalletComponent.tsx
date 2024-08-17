import React from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { FlexBoxCol } from "../styled/globalStyled";
import { WalletInfo, Card } from "./styles/airdrop.css";
import { useTonConnect } from "../../hooks/useTonConnect";

const WalletComponent: React.FC = () => {
  const { connected } = useTonConnect();

  return (
    <Card>
      <FlexBoxCol>
        <WalletInfo>
          Wallet {connected ? "connected" : "Not connected"}
        </WalletInfo>
        <TonConnectButton />
      </FlexBoxCol>
    </Card>
  );
};

export default WalletComponent;
