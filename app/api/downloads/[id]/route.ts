import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import GetUserRole from '@/app/components/server/GetUserRole';

export async function GET(req: Request, { params }: { params: { id: number } }) {
  const { id } = params;

  const item = await prisma.modItems.findUnique({
    where: { id },
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

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const role = await GetUserRole();
  if (role !== "ADMIN") NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await req.json();
  const {
    authors = [],
    authorTeams = [],
    releaseDate,
    id: _ignoreId,
    createdAt: _ignoreCreated,
    updatedAt: _ignoreUpdated,
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
                .filter((row: any) => row?.author?.id)
                .map((row: any) => ({
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

  return NextResponse.json(updated);
}
