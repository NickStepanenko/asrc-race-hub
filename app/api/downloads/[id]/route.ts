import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
  const itemId = Number(params.id);
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await req.json();
  const {
    authors = [],
    releaseDate,
    id: _ignoreId,
    createdAt: _ignoreCreated,
    updatedAt: _ignoreUpdated,
    ...rest
  } = body;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.modItemsAuthors.deleteMany({ where: { itemId } });

    return await tx.modItems.update({
      where: { id: itemId },
      data: {
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
      },
      include: { authors: { include: { author: true } } },
    });
  });

  return NextResponse.json(updated);
}
