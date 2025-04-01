
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeout: () => void;
  isPaused: boolean;
  onReset: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeout, isPaused, onReset }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when duration changes or when onReset is called
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, onReset]);

  // Handle the countdown
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onTimeout]);

  // Calculate the percentage for the progress bar
  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <div className="relative w-full max-w-xs h-8 bg-secondary rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-warmBrown font-medium">
          {timeLeft} secondes
        </span>
      </div>
      <div className="text-ember">
        <Clock className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Timer;
