import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// בנתיב: /api/summary/monthly
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const entries = await prisma.entry.findMany({
    where: {
      userId: Number(userId),
    },
  });

  const monthlyMap: Record<string, { totalIncome: number; totalExpense: number }> = {};

  for (const entry of entries) {
    const date = new Date(entry.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[key]) monthlyMap[key] = { totalIncome: 0, totalExpense: 0 };

    if (entry.type === 'income') monthlyMap[key].totalIncome += entry.amount;
    else monthlyMap[key].totalExpense += entry.amount;
  }

  const result = Object.entries(monthlyMap).map(([yearMonth, { totalIncome, totalExpense }]) => ({
    yearMonth,
    totalIncome,
    totalExpense,
  }));

  return NextResponse.json(result);
}
