import React, { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { PiCopySimple } from "react-icons/pi";
import styled from "styled-components";

interface SocialProps {
  referralToken: string;
  referredUsers: string[];
  activeTab: string;
}

const SocialContainer = styled.div`
background-color: #1c1c1e;
min-height: 80vh;
display: flex;
flex-direction: column;
align-items: center;
padding: 1rem;
width: 100%;
border-radius: 0.375rem;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

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
    <SocialContainer>
      <div className="flex w-full flex-col" >
        <div className="card bg-base-300 grid place-items-center">
          <div className="flex w-full place-items-center">
            <div className="card bg-base-300 rounded-box grid h-20 place-items-center">
                <button className="btn btn-success" onClick={handleRefForward}>
                  Invite Friends
                </button>
            </div>
            <div className="divider-horizontal"></div>
            <div className="card bg-base-300 rounded-box grid h-20 place-items-center">
                <button className="btn btn-success" onClick={handleRefClick}>
                  <PiCopySimple />
                </button>
            </div>
          </div>
        </div>
        <div className="card bg-base-300 grid place-items-center">
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-desc">Invited users</div>
              <div className="stat-value">{referredUsers.length}</div>
              <div className="stat-title">Airdrop to be announced</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-lg">
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
          </div>
        </div>
      </div>
    </SocialContainer>
  );
};

export default Social;
