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
      }?startapp=${referralToken}`
    );
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`
    );
  };

  return (
    <>
      <Card>
        <div className="flex w-full place-items-center justify-center">
          <Button onClick={handleRefForward}>Invite Friends</Button>
          <Divider />
          <Button onClick={handleRefClick}>
            <PiCopySimple />
          </Button>
        </div>
      </Card>
      <Card>
        <Stats>
          <StatDesc>Invited users</StatDesc>
          <StatValue>{referredUsers.length}</StatValue>
          <StatDesc>Airdrop to be announced</StatDesc>
        </Stats>
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
    </>
  );
};

export default FriendsComponent;
