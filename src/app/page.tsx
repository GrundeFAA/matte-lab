"use client";

import { useState } from "react";
import type { GameSettings, GameState, Question } from "#/types/game";
import QuestionDisplay from "#/components/QuestionDisplay";
import GameResults from "#/components/GameResults";
import CountdownTimer from "#/components/CountdownTimer";
import GameSettingsScreen from "#/components/GameSettings";
import { api } from "#/trpc/react";

const defaultSettings: GameSettings = {
  rounds: 15,
  min: 0,
  max: 10,
  timer: 5,
};

export default function Home() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    questions: [],
    score: 0,
    isGameOver: false,
    totalTime: 0,
    isWaitingForNextQuestion: false,
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // tRPC mutations
  const startSession = api.game.startSession.useMutation();
  const endSession = api.game.endSession.useMutation();
  const logAnswer = api.game.logAnswer.useMutation();

  const startGame = async (gameSettings: GameSettings) => {
    setIsLoading(true);
    const validatedSettings = {
      rounds: Math.max(1, Math.min(50, Number(gameSettings.rounds))),
      min: Math.max(0, Math.min(12, Number(gameSettings.min))),
      max: Math.max(gameSettings.min, Math.min(12, Number(gameSettings.max))),
      timer: Math.max(1, Number(gameSettings.timer)),
    };

    try {
      // Start new game session and wait for it
      const session = await startSession.mutateAsync({
        maxRounds: validatedSettings.rounds,
        minNumber: validatedSettings.min,
        maxNumber: validatedSettings.max,
      });

      setSessionId(session.id);
      setSettings(validatedSettings);
      setIsGameStarted(true);
      setStartTime(Date.now());

      // Generate first question...
      const factor1 =
        validatedSettings.min +
        Math.floor(
          Math.random() * (validatedSettings.max - validatedSettings.min + 1),
        );
      const factor2 =
        validatedSettings.min +
        Math.floor(
          Math.random() * (validatedSettings.max - validatedSettings.min + 1),
        );

      const newQuestion = {
        factor1,
        factor2,
        correctAnswer: factor1 * factor2,
      };

      setGameState((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
        currentRound: prev.currentRound + 1,
      }));
    } catch (error) {
      // Handle error - maybe show an error message to the user
      setIsGameStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: number) => {
    const currentQuestion = gameState.questions[gameState.currentRound - 1];
    if (!currentQuestion || !sessionId) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const responseTime = Date.now() - (startTime ?? Date.now());

    // Log the answer in the background
    logAnswer.mutate({
      sessionId,
      factor1: currentQuestion.factor1,
      factor2: currentQuestion.factor2,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      responseTime,
    });

    setGameState((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentRound - 1] = {
        ...currentQuestion,
        userAnswer: answer,
        isCorrect,
        responseTime,
      };

      const newState = {
        ...prev,
        questions: updatedQuestions,
        score: isCorrect ? prev.score + 1 : prev.score,
        isWaitingForNextQuestion: true,
      };

      if (prev.currentRound === settings.rounds) {
        newState.isGameOver = true;
        newState.totalTime = Date.now() - (startTime ?? Date.now());
        // End the session in the background
        if (sessionId) {
          endSession.mutate({
            sessionId,
            totalScore: isCorrect ? prev.score + 1 : prev.score,
          });
        }
      }

      return newState;
    });
  };

  const restartGame = () => {
    setGameState({
      currentRound: 0,
      questions: [],
      score: 0,
      isGameOver: false,
      totalTime: 0,
      isWaitingForNextQuestion: false,
    });
    setIsGameStarted(false);
    setStartTime(null);
    setSessionId(null);
  };

  const generateNewQuestion = (): Question => {
    const factor1 =
      settings.min +
      Math.floor(Math.random() * (settings.max - settings.min + 1));
    const factor2 =
      settings.min +
      Math.floor(Math.random() * (settings.max - settings.min + 1));

    const newQuestion = {
      factor1,
      factor2,
      correctAnswer: factor1 * factor2,
    };

    setGameState((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      currentRound: prev.currentRound + 1,
    }));

    return newQuestion;
  };

  const handleNextQuestion = () => {
    setGameState((prev) => ({
      ...prev,
      isWaitingForNextQuestion: false,
    }));

    if (!gameState.isGameOver) {
      generateNewQuestion();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <main className="mx-auto flex h-[100dvh] w-full max-w-[400px] flex-col px-2">
        <div className="relative flex-none py-2">
          <h1 className="text-center text-xl font-bold text-gray-800">
            Multiplikasjonsspill
          </h1>
          {isGameStarted && (
            <button
              onClick={restartGame}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Avbryt
            </button>
          )}
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-600">Starter spillet...</p>
              </div>
            </div>
          ) : !isGameStarted ? (
            <GameSettingsScreen
              onStart={startGame}
              defaultSettings={defaultSettings}
            />
          ) : gameState.isGameOver ? (
            <div className="flex h-full flex-col">
              <div className="min-h-0 flex-1">
                <GameResults
                  questions={gameState.questions}
                  score={gameState.score}
                  totalTime={gameState.totalTime}
                  totalRounds={settings.rounds}
                />
              </div>
              <div className="flex-none pb-6 pt-4">
                <button
                  onClick={restartGame}
                  className="w-full rounded-lg bg-blue-500 p-4 text-lg font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Spill Igjen
                </button>
              </div>
            </div>
          ) : gameState.isWaitingForNextQuestion ? (
            <div className="space-y-6 text-center">
              <div
                className={`rounded-lg p-6 ${
                  gameState.questions[gameState.currentRound - 1]?.isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <p className="text-xl font-medium">
                  {gameState.questions[gameState.currentRound - 1]?.isCorrect
                    ? "Riktig! 🎉"
                    : "Beklager, det var feil 😢"}
                </p>
                <p className="mt-2">
                  {gameState.questions[gameState.currentRound - 1]?.factor1} ×{" "}
                  {gameState.questions[gameState.currentRound - 1]?.factor2} ={" "}
                  {
                    gameState.questions[gameState.currentRound - 1]
                      ?.correctAnswer
                  }
                </p>
              </div>
              <div className="space-y-4">
                <CountdownTimer
                  duration={settings.timer}
                  onComplete={handleNextQuestion}
                />
                <button
                  onClick={handleNextQuestion}
                  className="w-full rounded-lg bg-blue-500 p-4 text-lg font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Hopp over nedtelling
                </button>
              </div>
            </div>
          ) : gameState.currentRound > 0 ? (
            (() => {
              const currentQuestion =
                gameState.questions[gameState.currentRound - 1];
              return currentQuestion ? (
                <QuestionDisplay
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  currentRound={gameState.currentRound}
                  totalRounds={settings.rounds}
                />
              ) : null;
            })()
          ) : null}
        </div>
      </main>
    </div>
  );
}
