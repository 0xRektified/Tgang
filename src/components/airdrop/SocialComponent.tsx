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
import { useVerifySocial } from "../../hooks/useVerifySocial";
import { ApiToast } from "../ApiToast";


interface SocialComponentProps {
  socials: Record<SocialChannel, SocialData>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const ResponsiveButton = styled(NeonButton)<{ isMember: boolean }>`
  width: ${props => props.isMember ? '10rem' : '6rem'};
`;

const SocialComponent: React.FC<SocialComponentProps> = ({
  socials,
  userInfo,
  setUserInfo,
}) => {
  const handleJoinClick = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  const {
    verifySocial,
    loading: socialLoading,
    error: socialError,
    successMessage: socialSuccessMessage,
  } = useVerifySocial();

  const handleVerifyClick = (channel: SocialChannel) => {
    verifySocial(channel, setUserInfo);
  };

  const renderVerifyButton = (channel: SocialChannel, isMember: boolean) => {
    if (isMember) {
      return <div></div>;
    }
    if (socialLoading) {
      return (
        <ResponsiveButton as={LockedButton} disabled isMember={false}>
          Loading...
        </ResponsiveButton>
      );
    }
    return (
      <ResponsiveButton
        as={NeonButton}
        onClick={() => handleVerifyClick(channel)}
        isMember={false}
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
                      {isMember ? (
                        <div className="card flex flex-col justify-center items-center text-center col-span-2">
                          <ResponsiveButton
                            as={NeonButton}
                            onClick={() => handleJoinClick(social.url)}
                            isMember={true}
                          >
                            Open
                          </ResponsiveButton>
                        </div>
                      ) : (
                        <>
                          <div className="card flex flex-col justify-center items-center text-center">
                            <ResponsiveButton
                              as={NeonButton}
                              onClick={() => handleJoinClick(social.url)}
                              isMember={false}
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
                        </>
                      )}
                    </div>
                  </CardInfoColumn>
                </CardDetails>
              </CardHeader>
            </CardContainer>
          );
        })}
        <ApiToast
          loading={socialLoading}
          error={socialError}
          successMessage={socialSuccessMessage}
        />
      </div>
    </div>
  );
};

export default SocialComponent;
