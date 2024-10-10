import { useState, useEffect } from 'react';

interface CountdownResult {
  formattedCountdown: string;
  isExpired: boolean;
}

export const useCountdown = (targetDate?: Date): CountdownResult => {
  const [countdown, setCountdown] = useState<CountdownResult>({
    formattedCountdown: '',
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) {
      setCountdown({ formattedCountdown: '', isExpired: true });
      return;
    }

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setCountdown({ formattedCountdown: '', isExpired: true });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);

        const formattedCountdown = parts.join(' ') || 'Ship now';
        setCountdown({ formattedCountdown, isExpired: false });
      }
    };

    calculateCountdown();
    const intervalId = setInterval(calculateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return countdown;
};