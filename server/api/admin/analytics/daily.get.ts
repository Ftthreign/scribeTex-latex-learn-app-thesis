import { defineEventHandler } from "h3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (_event) => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Ambil data kompilasi 7 hari terakhir
  const compilationData = await prisma.exerciseResult.findMany({
    where: { created_at: { gte: sevenDaysAgo } },
    select: { created_at: true },
    orderBy: { created_at: "asc" },
  });

  // Ambil data AI chat 7 hari terakhir
  const aiChatData = await prisma.aiChatHistory.findMany({
    where: { created_at: { gte: sevenDaysAgo } },
    select: { created_at: true },
    orderBy: { created_at: "asc" },
  });

  // Ambil progress records 7 hari terakhir
  const progressData = await prisma.userProgress.findMany({
    where: { updated_at: { gte: sevenDaysAgo } },
    select: { updated_at: true },
    orderBy: { updated_at: "asc" },
  });

  // Helper: Kelompokkan per hari
  function groupByDay(dates: Date[]) {
    const map: Record<string, number> = {};
    dates.forEach((d) => {
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  const compilationsByDay = groupByDay(
    compilationData.map((d) => d.created_at),
  );
  const aiChatsByDay = groupByDay(aiChatData.map((d) => d.created_at));
  const progressByDay = groupByDay(progressData.map((d) => d.updated_at));

  // Generate 7 label hari
  const labels: string[] = [];
  const compilationSeries: number[] = [];
  const aiChatSeries: number[] = [];
  const progressSeries: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
    });
    labels.push(label);
    compilationSeries.push(compilationsByDay[key] || 0);
    aiChatSeries.push(aiChatsByDay[key] || 0);
    progressSeries.push(progressByDay[key] || 0);
  }

  return {
    statusCode: 200,
    data: {
      labels,
      series: {
        compilations: compilationSeries,
        ai_chats: aiChatSeries,
        progress_updates: progressSeries,
      },
    },
  };
});
