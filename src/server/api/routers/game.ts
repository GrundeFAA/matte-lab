import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  startSession: publicProcedure
    .input(
      z.object({
        maxRounds: z.number(),
        minNumber: z.number(),
        maxNumber: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameSession.create({
        data: {
          maxRounds: input.maxRounds,
          minNumber: input.minNumber,
          maxNumber: input.maxNumber,
          totalScore: 0, // Will be updated at the end
        },
      });
    }),

  endSession: publicProcedure
    .input(
      z.object({
        sessionId: z.number(),
        totalScore: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameSession.update({
        where: { id: input.sessionId },
        data: {
          endTime: new Date(),
          totalScore: input.totalScore,
        },
      });
    }),

  logAnswer: publicProcedure
    .input(
      z.object({
        sessionId: z.number(),
        factor1: z.number(),
        factor2: z.number(),
        userAnswer: z.number(),
        correctAnswer: z.number(),
        isCorrect: z.boolean(),
        responseTime: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameAnswer.create({
        data: {
          factor1: input.factor1,
          factor2: input.factor2,
          userAnswer: input.userAnswer,
          correctAnswer: input.correctAnswer,
          isCorrect: input.isCorrect,
          responseTime: input.responseTime,
          gameSessionId: input.sessionId,
        },
      });
    }),
});
