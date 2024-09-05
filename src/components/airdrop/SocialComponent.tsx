import React from "react";
import { IUserInfo } from "../interfaces/user.interface";
import {
  CardContainer,
  CardInfoColumn,
  NeonButton,
  CardHeader,
  CardImage,
  CardDetails,
  CardTitle,
} from "../styled/cardStyled";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import { Button, Card, StatDesc } from "./styles/airdrop.css";
import WebApp from "@twa-dev/sdk";
import styled from "styled-components";
import { useVerifySocial } from "../../hooks/useVerifySocial";
import { ApiToast } from "../ApiToast";
import { useJoinSocial } from "../../hooks/useJoinSocial";

const ColoredText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0 2px currentColor;
  transition: text-shadow 0.3s ease;

  &.cash {
    color: #2e9dff;
  }
  &.rep {
    color: #2e9dff;
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RewardText = styled.div`
  margin-top: 0.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

export const CardImageSocial = styled(CardImage)<{ $title: string }>`
  width: ${({ $title }) =>
    $title === "Cartel X"
      ? "40px"
      : $title === "Cartel Youtube"
      ? "60px"
      : "50px"};
  height: ${({ $title }) =>
    $title === "Cartel X"
      ? "40px"
      : $title === "Cartel Youtube"
      ? "60px"
      : "50px"};
  border-radius: 0.5rem;
`;

interface SocialComponentProps {
  socials: Record<SocialChannel, SocialData>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setIsSocialModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResponsiveButton = styled(NeonButton)<{ isMember: boolean }>`
  width: ${(props) => (props.isMember ? "10rem" : "6rem")};
`;

const SocialComponent: React.FC<SocialComponentProps> = ({
  socials,
  userInfo,
  setUserInfo,
  setIsSocialModalOpen,
}) => {
  const {
    verifySocial,
    loading: socialLoading,
    error: socialError,
    successMessage: socialSuccessMessage,
  } = useVerifySocial();

  const { joinSocial } = useJoinSocial();

  const handleJoinClick = (url: string, channel: SocialChannel) => {
    joinSocial(channel, setIsSocialModalOpen);
    switch (channel) {
      case SocialChannel.TELEGRAM_CHANNEL:
      case SocialChannel.TELEGRAM_GROUP:
        WebApp.openTelegramLink(url);
        break;
      default:
        WebApp.openLink(url);
        break;
    }
  };

  const handleVerifyClick = (channel: SocialChannel) => {
    verifySocial(channel, setUserInfo);
  };

  const renderVerifyButton = (channel: SocialChannel, isMember: boolean) => {
    if (isMember) {
      return <div></div>;
    }
    // if (socialLoading) {
    //   return (
    //     <ResponsiveButton as={LockedButton} disabled isMember={false}>
    //       Loading...
    //     </ResponsiveButton>
    //   );
    // }
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
    <Card style={{ marginBottom: "10em" }}>
      <StatDesc className="font-bold mb-4">
        Follow our socials to get some Alpha
      </StatDesc>
      <div className="space-y-2">
        {Object.entries(socials).map(([channel, social]) => {
          const userSocial = userInfo.socials?.find(
            (s) => s.channel === channel,
          );
          const isMember = userSocial?.member || false;

          return (
            <CardContainer style={{ padding: "0rem", marginBottom: "1rem" }}>
              <CardHeader>
                <CardImageContainer>
                  <CardImageSocial
                    src={social.image}
                    alt={social.title}
                    loading="lazy"
                    $title={social.title}
                  />

                  <RewardText>
                    <ColoredText className="cash">+1000$</ColoredText>
                    <ColoredText className="rep">+100rp</ColoredText>
                  </RewardText>
                </CardImageContainer>
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
                            onClick={() =>
                              handleJoinClick(
                                social.url,
                                channel as SocialChannel,
                              )
                            }
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
                              onClick={() =>
                                handleJoinClick(
                                  social.url,
                                  channel as SocialChannel,
                                )
                              }
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
    </Card>
  );
};

export default SocialComponent;
