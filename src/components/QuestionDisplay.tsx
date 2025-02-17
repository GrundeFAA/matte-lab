"use client";

import { useState } from "react";
import type { Question } from "#/types/game";
import NumericKeypad from "./NumericKeypad";

interface Props {
  question: Question;
  onAnswer: (answer: number) => void;
  currentRound: number;
  totalRounds: number;
}

export default function QuestionDisplay({
  question,
  onAnswer,
  currentRound,
  totalRounds,
}: Props) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const numAnswer = Number(answer);
    if (!isNaN(numAnswer)) {
      onAnswer(numAnswer);
      setAnswer("");
    }
  };

  const handleNumber = (num: number) => {
    setAnswer((prev) => {
      if (prev.length >= 3) return prev; // Prevent too long numbers
      // If the current value is "0", replace it with the new number
      if (prev === "0") return num.toString();
      return prev + num.toString();
    });
  };

  const handleDelete = () => {
    setAnswer((prev) => {
      if (prev.length <= 1) return "";
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 pb-4">
      <div className="w-full rounded-lg bg-white p-2 shadow-sm">
        <p className="text-center text-sm font-medium text-gray-500">
          Runde {currentRound} av {totalRounds}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-gray-800">
          {question.factor1} × {question.factor2}
        </div>
        <p className="mt-2 text-sm text-gray-500">Hva er svaret?</p>
      </div>

      <div className="w-full">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mb-2 h-12 w-full rounded-lg border-2 border-gray-200 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
          placeholder="Skriv svaret her"
          readOnly
        />
        <NumericKeypad
          onNumber={handleNumber}
          onDelete={handleDelete}
          onSubmit={() => handleSubmit()}
          currentValue={answer}
        />
      </div>
    </div>
  );
}
