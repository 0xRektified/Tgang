import React from "react";
import { IUserInfo } from "../interfaces/user.interface";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import WebApp from "@twa-dev/sdk";
import { useVerifySocial } from "../../hooks/useVerifySocial";
import { ApiToast } from "../ApiToast";
import { useJoinSocial } from "../../hooks/useJoinSocial";
import { FaCoins } from "react-icons/fa";
import { GiRank3 } from "react-icons/gi";
import { FaCheck } from "react-icons/fa"; // Add this import
import {
  SocialCard,
  SocialCardContent,
  SocialCardImageContainer,
  SocialCardImage,
  SocialCardDetails,
  SocialCardTitle,
  SocialButton,
  SocialButtonContainer,
  RewardInfo,
  RewardItem,
  RewardAmount,
  StatDesc,
  GlobalContainer, // Add this import
  RewardIcon,
  RewardText,
} from "./styles/socialStyled.css";

interface SocialComponentProps {
  socials: Record<SocialChannel, SocialData>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
  setIsSocialModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
      return (
        <SocialButton isMember={true} disabled>
          <FaCheck /> Verified
        </SocialButton>
      );
    }
    return (
      <SocialButton isMember={false} onClick={() => handleVerifyClick(channel)}>
        Verify
      </SocialButton>
    );
  };

  return (
    <GlobalContainer>
      <StatDesc>Follow our socials to get some Alpha</StatDesc>
      <div>
        {Object.entries(socials).map(([channel, social]) => {
          const userSocial = userInfo.socials?.find(
            (s) => s.channel === channel,
          );
          const isMember = userSocial?.member || false;

          return (
            <SocialCard key={channel}>
              <SocialCardContent>
                <SocialCardImageContainer>
                  <SocialCardImage
                    src={social.image}
                    alt={social.title}
                    loading="lazy"
                    $title={social.title}
                  />
                </SocialCardImageContainer>
                <SocialCardDetails>
                  <SocialCardTitle>{social.title}</SocialCardTitle>
                  <SocialButtonContainer>
                    <SocialButton
                      isMember={false}
                      onClick={() =>
                        handleJoinClick(social.url, channel as SocialChannel)
                      }
                    >
                      {isMember ? "Open" : "Join"}
                    </SocialButton>
                    {renderVerifyButton(channel as SocialChannel, isMember)}
                  </SocialButtonContainer>
                </SocialCardDetails>
              </SocialCardContent>
              <RewardInfo>
                <RewardItem>
                  <RewardIcon>
                    <FaCoins />
                  </RewardIcon>
                  <RewardText>Reward:</RewardText>
                  <RewardAmount>1000$</RewardAmount>
                </RewardItem>
                <RewardItem>
                  <RewardIcon>
                    <GiRank3 />
                  </RewardIcon>
                  <RewardText>Rep:</RewardText>
                  <RewardAmount>+100</RewardAmount>
                </RewardItem>
              </RewardInfo>
            </SocialCard>
          );
        })}
        <ApiToast
          loading={socialLoading}
          error={socialError}
          successMessage={socialSuccessMessage}
        />
      </div>
    </GlobalContainer>
  );
};

export default SocialComponent;
