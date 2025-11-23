import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import GetUserRole from '@/app/components/server/GetUserRole';
import { ItemAuthor } from '@/types';
import { getCached, setCached } from "@/server/redis/cache";

const downloadsListCacheKey = "downloads:v1";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const cacheKey = `downloads:v1:item-${itemId}`;
  const cached = await getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  const item = await prisma.modItems.findUnique({
    where: { id: itemId },
    include: {
      authors: {
        include: {
          author: true, // pulls the actual Author row for each join row
        },
      },
      authorTeams: {
        include: { team: true }, // keep any other relations you need
      },
    },
  });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await setCached(cacheKey, item);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const role = await GetUserRole();
  if (role !== "ADMIN") return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const cacheKey = `downloads:v1:item-${itemId}`;

  const body = await req.json();
  const {
    authors = [],
    authorTeams = [],
    releaseDate,
    ...rest
  } = body;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.modItemsAuthors.deleteMany({ where: { itemId } });
    await tx.modItemsModdingTeams.deleteMany({ where: { itemId } });

    return await tx.modItems.update({
      where: { id: itemId },
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
                .filter((teamId: string) => teamId)
                .map((teamId: string) => ({
                  team: { connect: { id: parseInt(teamId) } },
                })),
            }
          : undefined,
      },
      include: { authors: { include: { author: true } } },
    });
  });

  await setCached(cacheKey, null);
  await setCached(downloadsListCacheKey, null);
  return NextResponse.json(updated);
}
