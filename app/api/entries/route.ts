import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const entries = await prisma.entry.findMany({
    where: { userId: Number(userId) },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const newEntry = await prisma.entry.create({
    data: {
      type: data.type,
      description: data.description,
      amount: data.amount,
      date: data.date,
      userId: Number(data.userId),
    },
  });
  return NextResponse.json(newEntry);
}
