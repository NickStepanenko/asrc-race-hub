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
  try {
    const url = new URL(req.url);
    const sortKey = url.searchParams.get('sort') ?? 'name_asc';

    // Pick a safe orderBy from the map, or default to 'newest'.
    const orderBy = SORT_MAP[sortKey] ?? SORT_MAP.name_asc;

    const data = await prisma.modItems.findMany({
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        carClass: true,
        image: true,
        logo: true,
        url: true,
        released: true,
        releaseDate: true,
        specs: true,
        features: true,
        screenshots: true,
        metadata: true,
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('GET /api/downloads error', err);
    return NextResponse.json({ error: 'Failed to load downloads' }, { status: 500 });
  }
}