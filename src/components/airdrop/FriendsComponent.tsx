import React from "react";
import WebApp from "@twa-dev/sdk";
import { PiCopySimple } from "react-icons/pi";
import {
  Button,
  Divider,
  Card,
  Stats,
  StatDesc,
  StatValue,
  Table,
  TableContainer,
} from "./styles/airdrop.css";
import styled from "styled-components";

interface FriendsComponentProps {
  referralToken: string;
  referredUsers: string[];
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  referralToken,
  referredUsers,
}) => {
  const handleRefForward = () => {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${
        import.meta.env.VITE_WEB_APP_URL
      }?startapp=${referralToken}`,
    );
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`,
    );
  };

  return (
    <Card className="scrollable-content">
      <div className="w-1/4 flex flex-col items-center justify-center">
        <Stats>
          <StatDesc>Invited users</StatDesc>
          <StatValue>{referredUsers.length}</StatValue>
        </Stats>
      </div>
      <div className="w-3/4 flex flex-col items-center justify-center">
        <div className="flex mb-4">
          <div className=" flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="font-bold">
                Invite User <span className="text-2xl mb-4">💰</span>
              </h3>
              <p>Earn $1000 and 500 reputation</p>
            </div>
            {/* <div>
              <h3 className="font-bold">
                Invite Premium User <span className="text-2xl">💰💰💰</span>
              </h3>
              <p>Earn $2000 and 1000 reputation</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex w-full place-items-center justify-center">
        <Button onClick={handleRefForward}>Invite Friends</Button>
        <Divider />
        <Button onClick={handleRefClick}>
          <PiCopySimple />
        </Button>
      </div>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Referred Users</th>
            </tr>
          </thead>
          <tbody>
            {referredUsers.map((user) => (
              <tr key={user}>
                <td>{user}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default FriendsComponent;
