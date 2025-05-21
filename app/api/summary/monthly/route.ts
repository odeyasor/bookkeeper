import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userIdParam = req.nextUrl.searchParams.get('userId');
    const month = req.nextUrl.searchParams.get('month');

    if (!userIdParam || !month) {
      return NextResponse.json({ error: 'Missing userId or month' }, { status: 400 });
    }

    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const [year, monthStr] = month.split("-");
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(Number(year), Number(monthStr), 1);

    const entries = await prisma.entry.findMany({
      where: {
        userId,
       date: {
  gte: startDate.toISOString(),
  lt: endDate.toISOString(),
}

      },
      orderBy: {
        date: 'asc',
      },
    });

    const dailyTotals: Record<string, number> = {};
    let balance = 0;

    for (const entry of entries) {
      const day = new Date(entry.date).getDate();
      const key = day.toString().padStart(2, '0');
      if (!dailyTotals[key]) dailyTotals[key] = balance;

      balance += entry.type === 'income' ? entry.amount : -entry.amount;
      dailyTotals[key] = balance;
    }

    const response = Object.entries(dailyTotals).map(([day, balance]) => ({
      day,
      balance,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
