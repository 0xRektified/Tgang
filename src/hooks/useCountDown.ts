import { useState, useEffect } from 'react';

export const useCountdown = (targetDate?: Date) => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!targetDate) {
      setCountdown('');
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setCountdown('');
        clearInterval(intervalId);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return countdown;
};