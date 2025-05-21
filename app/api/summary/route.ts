import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const month = req.nextUrl.searchParams.get('month'); // למשל "2025-05"
    console.log("8")

  if (!userId || !month) {
    return NextResponse.json({ error: 'Missing userId or month' }, { status: 400 });
  }
    console.log("9")

  const entries = await prisma.entry.findMany({
    where: {
      userId: Number(userId),
   date: {
  gte: new Date(`${month}-01`).toISOString(),
  lt: new Date(`${month}-32`).toISOString(),
},

    },
    orderBy: {
      date: 'asc',
    },
  });
    console.log("10")

  // סכימה יומית
  const dailyTotals: Record<string, number> = {};
  let balance = 0;
    console.log("11")

  for (const entry of entries) {
    const day = new Date(entry.date).getDate();
    const key = day.toString().padStart(2, '0');
    console.log("12")

    if (!dailyTotals[key]) dailyTotals[key] = balance;
    console.log("13")

    balance += entry.type === 'income' ? entry.amount : -entry.amount;
    dailyTotals[key] = balance;
  }
    console.log("14")

  const response = Object.entries(dailyTotals).map(([day, balance]) => ({
    day,
    balance,
  }));
    console.log("15")

  return NextResponse.json(response);
}
