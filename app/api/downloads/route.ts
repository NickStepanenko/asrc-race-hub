import GetUserRole from '@/app/components/server/GetUserRole';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Allowed sort keys and their corresponding Prisma orderBy clauses.
// Keep this list small and explicit to avoid unexpected/unsafe inputs.
const SORT_MAP: Record<string, any> = {
  newest: [{ releaseDate: 'desc' }, { name: 'asc' }],
  oldest: [{ releaseDate: 'asc' }, { name: 'asc' }],
  name_asc: [{ name: 'asc' }],
  name_desc: [{ name: 'desc' }],
  released_first: [{ released: 'desc' }, { releaseDate: 'desc' }],
};

export async function GET(req: NextRequest) {
  const role = await GetUserRole();

  try {
    const url = new URL(req.url);
    const sortKey = url.searchParams.get('sort') ?? 'name_asc';

    const orderBy = SORT_MAP[sortKey] ?? SORT_MAP.name_asc;

    const data = await prisma.modItems.findMany({
      orderBy,
      include: {
        authors: {
          include: {
            author: true,
          },
        },
        authorTeams: {
          include: { team: true },
        },
      },
      where: {
        ...(role !== "ADMIN" ? { hidden: false } : {})
      }
    });

    return NextResponse.json(data);
  }
  catch (err: any) {
    console.error('GET /api/downloads error', err);
    return NextResponse.json({ error: 'Failed to load downloads' }, { status: 500 });
  }
}
