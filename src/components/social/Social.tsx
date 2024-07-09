import React, { useState, useEffect } from "react";
import {
  FlexBoxRow,
} from "../styled/shopStyled";
import { Card } from "../styled/globalStyled";
import WebApp from "@twa-dev/sdk";

interface SocialProps {
  referralToken: string;
  referredUsers: string[];
  activeTab: string;
}

export const Social: React.FC<SocialProps> = ({
  referralToken,
  referredUsers,
  activeTab,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  console.log(currentTab);
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleRefForward = () => {
    WebApp.openTelegramLink(`https://t.me/share/url?url=${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`);
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(referralToken);
  };

  return (
    <FlexBoxRow>
      <h1>Referral Link</h1>
      <Card onClick={handleRefForward}>
        Share
      </Card>
      <Card onClick={handleRefClick}>
        {referralToken}
      </Card>
      <table>
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
      </table>
    </FlexBoxRow>
  );
};

export default Social;
