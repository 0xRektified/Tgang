import React, { useEffect } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { FlexBoxCol } from "../styled/globalStyled";
import { WalletInfo, Card } from "./styles/airdrop.css";
import { useTonConnect } from "../../hooks/useTonConnect";
import { IUserInfo } from "../interfaces/user.interface";
import { useSetUserWallet } from "../../hooks/useSetUserWallet";

interface WalletProps {
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const WalletComponent: React.FC<WalletProps> = ({ userInfo, setUserInfo }) => {
  const { connected } = useTonConnect();
  const tonWalletAddress = useTonAddress();
  const { setWallet } = useSetUserWallet();
  useEffect(() => {
    console.log(tonWalletAddress);
    console.log(`userInfo`);
    console.log(userInfo);
    if (!userInfo.wallet) {
      setWallet(tonWalletAddress, setUserInfo);
    }
  }, [tonWalletAddress]);
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
