import type { Question } from "#/types/game";

interface Props {
  questions: Question[];
  score: number;
  totalTime: number;
  totalRounds: number;
}

export default function GameResults({
  questions,
  score,
  totalTime,
  totalRounds,
}: Props) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutt${minutes !== 1 ? "er" : ""} og ${remainingSeconds} sekund${remainingSeconds !== 1 ? "er" : ""}`;
  };

  const analyzeProblematicFactors = () => {
    const factorStats = new Map<number, { total: number; incorrect: number }>();

    questions.forEach((q) => {
      [q.factor1, q.factor2].forEach((factor) => {
        const stats = factorStats.get(factor) ?? { total: 0, incorrect: 0 };
        stats.total++;
        if (!q.isCorrect) stats.incorrect++;
        factorStats.set(factor, stats);
      });
    });

    const problematicFactors = Array.from(factorStats.entries())
      .filter(([_, stats]) => stats.incorrect / stats.total > 0.5)
      .map(([factor]) => factor)
      .sort((a, b) => a - b);

    return problematicFactors;
  };

  const problematicFactors = analyzeProblematicFactors();

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">Spillet er ferdig!</h2>

      <div className="space-y-4">
        <p className="text-xl">
          Gratulerer! Du fikk {score} av {totalRounds} riktige svar.
        </p>

        <p>Du brukte totalt {formatTime(totalTime)}.</p>

        {problematicFactors.length > 0 && (
          <div className="space-y-2">
            <p>Det ser ut til at multiplikasjoner med:</p>
            <p className="font-medium text-gray-800">
              {problematicFactors.join(" og ")}
            </p>
            <p>var utfordrende for deg.</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Detaljert oversikt:</h3>
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`rounded p-2 ${q.isCorrect ? "bg-green-100" : "bg-red-100"}`}
              >
                {q.factor1} × {q.factor2} = {q.userAnswer}
                {!q.isCorrect && ` (Riktig svar: ${q.correctAnswer})`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
