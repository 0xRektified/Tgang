import React from "react";
import { IUserInfo } from "../interfaces/user.interface";
import {
  CardContainer,
  CardInfoColumn,
  LockedButton,
  NeonButton,
  CardHeader,
  CardImage,
  CardDetails,
  CardTitle,
} from "../styled/cardStyled";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import { Button, StatDesc } from "./styles/airdrop.css";
import WebApp from "@twa-dev/sdk";
import styled from "styled-components";

const ResponsiveButton = styled(NeonButton)`
  width: 6rem;
`;

interface SocialComponentProps {
  socials: Record<SocialChannel, SocialData>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  verifySocial: (
    chanel: SocialChannel,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => Promise<void>;
  loading: boolean;
}

const SocialComponent: React.FC<SocialComponentProps> = ({
  socials,
  userInfo,
  setUserInfo,
  verifySocial,
  loading,
}) => {
  const handleJoinClick = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  const handleVerifyClick = (channel: SocialChannel) => {
    verifySocial(channel, setUserInfo);
  };

  const renderVerifyButton = (channel: SocialChannel, isMember: boolean) => {
    if (isMember) {
      return <></>;
    }
    if (loading) {
      return (
        <ResponsiveButton as={LockedButton} disabled>
          Loading...
        </ResponsiveButton>
      );
    }
    return (
      <ResponsiveButton
        as={NeonButton}
        onClick={() => handleVerifyClick(channel)}
      >
        Verify
      </ResponsiveButton>
    );
  };

  return (
    <div>
      <StatDesc className="font-bold mb-4">
        Join our socials to get $1000 and 100 rep each!
      </StatDesc>
      <div className="space-y-2">
        {Object.entries(socials).map(([channel, social]) => {
          const isMember = userInfo.socials?.find((s) => s.channel === channel);

          return (
            <CardContainer style={{ padding: "0rem" }}>
              <CardHeader>
                <CardImage
                  src={social.image}
                  alt={social.title}
                  loading="lazy"
                />
                <CardDetails>
                  <CardInfoColumn>
                    <CardTitle>
                      {social.title} {!!isMember ? `✅` : ``}
                    </CardTitle>

                    <div className="grid grid-cols-2 gap-4 w-full pb-4">
                      <div className="card flex flex-col justify-center items-center text-center">
                        <ResponsiveButton
                          as={NeonButton}
                          onClick={() => handleJoinClick(social.url)}
                        >
                          Open
                        </ResponsiveButton>
                      </div>
                      <div className="card flex flex-col justify-center items-center text-center">
                        {renderVerifyButton(
                          channel as SocialChannel,
                          !!isMember,
                        )}
                      </div>
                    </div>
                  </CardInfoColumn>
                </CardDetails>
              </CardHeader>
            </CardContainer>
          );
        })}
      </div>
    </div>
  );
};

export default SocialComponent;
