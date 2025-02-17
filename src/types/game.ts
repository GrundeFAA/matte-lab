export interface GameSettings {
  rounds: number;
  min: number;
  max: number;
  timer: number;
}

export interface Question {
  factor1: number;
  factor2: number;
  correctAnswer: number;
  userAnswer?: number;
  responseTime?: number;
  isCorrect?: boolean;
}

export interface GameState {
  currentRound: number;
  questions: Question[];
  score: number;
  isGameOver: boolean;
  totalTime: number;
  isWaitingForNextQuestion: boolean;
}
