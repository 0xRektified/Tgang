export const formatPrice = (price: number, showDecimals: boolean) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
};

export const convertSecondsToReadableTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h${minutes ? `${minutes}m` : ""}`;
};

export const formatSeconds = (time: number) => {
  const hours = Math.floor((time / (60 * 60)) % 24);
  const minutes = Math.floor((time / 60) % 60);
  const seconds = Math.floor(time % 60);

  return { hours, minutes, seconds };
};

export const calculateProgress = (
  reputation: number,
  minReputation: number,
  maxReputation: number,
): number => {
  const range = maxReputation - minReputation;
  const progress = ((reputation - minReputation) / range) * 100;
  return Math.min(Math.max(progress, 0), 100);
};
