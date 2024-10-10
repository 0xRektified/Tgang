import React from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ApiToast } from "../ApiToast";
import { useAchievements } from "../../hooks/useAchievements";
import { useCountdown } from "../../hooks/useCountDown";

import {
  AchievementCard,
  AchievementIconContainer,
  AchievementDetails,
  AchievementTitle,
  AchievementDescription,
  GlobalContainer,
  StatDesc,
  AchievementsSummary,
  TrophyIcon,
  UnlockButton,
  ButtonIcon,
  AchievementIcon,
  AchievementRequirements,
  AchievementTopRow,
  AchievementBottomRow,
  LimitedOfferBanner,
  CountdownTimer,
  StopwatchIcon,
} from "./styles/achievementsStyled";
import { IUserInfo } from "../interfaces/user.interface";
import { IAchievement } from "../interfaces/achievements.interface";

interface AchievementsComponentProps {
  userInfo: IUserInfo;
  achievements: IAchievement[];
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const AchievementComponent: React.FC<{
  achievement: IAchievement;
  isUnlocked: boolean;
  onUnlock: () => void;
  loading: boolean;
}> = ({ achievement, isUnlocked, onUnlock, loading }) => {
  const { formattedCountdown, isExpired } = useCountdown(achievement?.timeLimit);

  return (
    <div style={{ marginTop: "2em" }}>
      <AchievementCard isUnlocked={isUnlocked}>
        <AchievementTopRow>
          <AchievementDetails>
            <AchievementTitle>{achievement.name}</AchievementTitle>
            <AchievementDescription>
              {achievement.description}
            </AchievementDescription>
            <AchievementRequirements>
              Requirements {achievement.requirements}
            </AchievementRequirements>
          </AchievementDetails>
          <AchievementIconContainer>
            <AchievementIcon src={achievement.image} alt={achievement.name} />
          </AchievementIconContainer>
        </AchievementTopRow>
        {!isUnlocked && !isExpired && (
          <LimitedOfferBanner>
            <StopwatchIcon />
            Expired in
            <CountdownTimer>{formattedCountdown}</CountdownTimer>
          </LimitedOfferBanner>
        )}
        <AchievementBottomRow>
          <UnlockButton
            onClick={() => !isUnlocked && onUnlock()}
            disabled={isUnlocked || loading}
            unlocked={isUnlocked}
          >
            <ButtonIcon>{isUnlocked ? <FaUnlock /> : <FaLock />}</ButtonIcon>
            {isUnlocked ? "Unlocked" : "Unlock"}
          </UnlockButton>
        </AchievementBottomRow>
      </AchievementCard>
    </div>
  );
};

const AchievementsComponent: React.FC<AchievementsComponentProps> = ({
  userInfo,
  achievements,
  setUserInfo,
}) => {
  const { unlockAchievement, loading, error, successMessage } =
    useAchievements(setUserInfo);

  const unlockedAchievementsCount = Object.values(
    userInfo.achievements || {},
  ).filter(Boolean).length;

  return (
    <GlobalContainer>
      <AchievementsSummary>
        <TrophyIcon />
        <span>
          {unlockedAchievementsCount} / {achievements.length} Achievements
          Unlocked
        </span>
      </AchievementsSummary>
      <StatDesc>Unlock achievements for exclusive content</StatDesc>
      {achievements.map((achievement) => {
        const isUnlocked = userInfo.achievements?.[achievement.id] || false;
        return (
          <AchievementComponent
            key={achievement.id}
            achievement={achievement}
            isUnlocked={isUnlocked}
            onUnlock={() => unlockAchievement(achievement.id)}
            loading={loading}
          />
        );
      })}
      <ApiToast
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </GlobalContainer>
  );
};

export default AchievementsComponent;
