import ItemEditForm from "./index";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = { params: { id: string } };

export default async function ItemEditPage({ params }: PageProps) {
  const rawId = await params.id;
  const isNewItem = rawId === "new";

  if (isNewItem) {
    return <ItemEditForm itemId="new" initialItem={null} />;
  }

  const parsedId = Number(rawId);
  if (!Number.isFinite(parsedId)) {
    notFound();
  }

  const item = await prisma.modItems.findUnique({
    where: { id: parsedId },
    include: {
      authors: { include: { author: true } },
      authorTeams: { include: { team: true } },
    },
  });

  const authors = await prisma.authors.findMany({orderBy: { id: "asc" }});
  const moddingTeams = await prisma.moddingTeams.findMany({orderBy: { id: "asc" }});

  if (!item) {
    notFound();
  }

  return <ItemEditForm
    itemId={rawId}
    initialItem={item}
    authors={authors}
    moddingTeams={moddingTeams}
  />;
}
