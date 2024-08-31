import React, { useState, useEffect } from "react";
import { IUserInfo } from "../interfaces/user.interface";
import { Button, CardContainer, CardInfoColumn, LockedButton, NeonButton } from "../styled/cardStyled";
import { CardHeader, CardImage, CardDetails, CardTitle } from "../styled/cardStyled";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import { DigitalFont } from "../styled/topmenu";
import { AirdropContainer, StatDesc } from "./styles/airdrop.css";
import WebApp from "@twa-dev/sdk";
import { useVerifySocial } from "../../hooks/useVerifySocial";

interface SocialComponentProps {
  socials: Record<SocialChannel, SocialData>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  verifySocial: (channel: SocialChannel, setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>) => void;
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
      return (
        <LockedButton disabled>Joined</LockedButton>
      );
    }
    if (loading) {
      return (
        <LockedButton disabled>Loading...</LockedButton>
      );
    }
    return (
      <NeonButton onClick={() => handleVerifyClick(channel)}>Verify</NeonButton>
    );
  };

  return (
    <div>
      <StatDesc>
        Join our socials to get $1000 and 100 rep each!
      </StatDesc>
      <div className="space-y-2">
        {Object.entries(socials).map(([channel, social]) => {
          const isMember = userInfo.socials?.find((s) => s.channel === channel);

          return (
            <CardContainer>
              <CardHeader>
                <CardImage src={social.image} alt={social.title} loading="lazy" />
                <CardDetails>
                  <CardInfoColumn>
                    <CardTitle>{social.title}</CardTitle>

                    <div className="grid grid-cols-2 gap-4 w-full pb-4">
                      <div className="card flex flex-col justify-center items-center text-center">
                        <NeonButton onClick={() => handleJoinClick(social.url)}>
                          Open
                        </NeonButton>
                      </div>
                      <div className="card flex flex-col justify-center items-center text-center">
                        {renderVerifyButton(channel as SocialChannel, !!isMember)}
                      </div>
                    </div>
                  </CardInfoColumn>
                </CardDetails>
              </CardHeader>
            </CardContainer>
          )
        })}
      </div>
    </div>
  );
};

export default SocialComponent;
