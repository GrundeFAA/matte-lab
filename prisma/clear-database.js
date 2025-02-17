import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete all records from each table
    // Order matters due to foreign key constraints
    const deleteAnswers = prisma.gameAnswer.deleteMany();
    const deleteSessions = prisma.gameSession.deleteMany();
    const deleteMathlog = prisma.mathlog.deleteMany();

    // Execute all deletes in transaction
    await prisma.$transaction([deleteAnswers, deleteSessions, deleteMathlog]);
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase().catch(console.error);
