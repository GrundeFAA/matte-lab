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

  const formatList = (numbers: number[]): string => {
    if (!numbers || numbers.length === 0) return "";
    if (numbers.length === 1) return numbers[0]?.toString() ?? "";
    if (numbers.length === 2) return `${numbers[0]} og ${numbers[1]}`;
    const allButLast = numbers.slice(0, -1);
    const last = numbers[numbers.length - 1];
    return `${allButLast.join(", ")} og ${last}`;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-none">
        <h2 className="text-center text-2xl font-bold">Spillet er ferdig!</h2>

        <div className="mt-6 space-y-4">
          <p className="text-xl">
            Gratulerer! Du fikk {score} av {totalRounds} riktige svar.
          </p>

          <p>Du brukte totalt {formatTime(totalTime)}.</p>

          {problematicFactors.length > 0 && (
            <div className="space-y-2">
              <p>Det ser ut til at multiplikasjoner med:</p>
              <p className="font-medium text-gray-800">
                {formatList(problematicFactors)} var utfordrende for deg.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Detaljert oversikt:</h3>
          <div
            className="mt-4 space-y-2 overflow-y-auto pr-2"
            style={{ maxHeight: "calc(100vh - 26rem)" }}
          >
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
