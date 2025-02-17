import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete all records from each table
    // Order matters due to foreign key constraints
    console.log("Clearing database...");

    const deleteAnswers = prisma.gameAnswer.deleteMany();
    const deleteSessions = prisma.gameSession.deleteMany();
    const deleteMathlog = prisma.mathlog.deleteMany();

    // Execute all deletes in transaction
    await prisma.$transaction([deleteAnswers, deleteSessions, deleteMathlog]);

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase().catch(console.error);
