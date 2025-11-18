import GetUserRole from '@/app/components/server/GetUserRole';
import { prisma } from '@/lib/prisma';
import { ItemAuthor } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Allowed sort keys and their corresponding Prisma orderBy clauses.
// Keep this list small and explicit to avoid unexpected/unsafe inputs.
const SORT_MAP: Record<string, object[]> = {
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
  catch {
    return NextResponse.json({ error: 'Failed to load downloads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const role = await GetUserRole();
  if (role !== "ADMIN") NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const body = await req.json();
  const {
    authors = [],
    authorTeams = [],
    releaseDate,
    ...rest
  } = body;

  const updated = await prisma.$transaction(async (tx) => {
    return await tx.modItems.create({
      data: {
        releaseDate,
        ...rest,
        authors: authors.length
          ? {
              create: authors
                .filter((row: ItemAuthor) => row?.author?.id)
                .map((row: ItemAuthor) => ({
                  role: (row.role ?? 'Contributor').toString(),
                  author: { connect: { id: Number(row.author.id) } },
                })),
            }
          : undefined,
        authorTeams: authorTeams.length
          ? {
              create: authorTeams
                .filter((teamId: string | number) => teamId)
                .map((teamId: string | number) => ({
                  team: { connect: { id: Number(teamId) } },
                })),
            }
          : undefined,
      },
      include: { authors: { include: { author: true } } },
    });
  });

  return NextResponse.json(updated);
}
