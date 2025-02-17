"use client";

import { useEffect, useState } from "react";

interface Props {
  duration: number;
  onComplete: () => void;
}

export default function CountdownTimer({ duration, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="text-center">
      <div className="mb-4 inline-block rounded-full bg-blue-500 px-6 py-2 text-3xl font-bold text-white">
        {timeLeft}
      </div>
      <p className="text-lg text-gray-600">Gjør deg klar for neste spørsmål!</p>
    </div>
  );
}
