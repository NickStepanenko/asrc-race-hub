import ItemEditForm from "./index";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import { getCached, setCached } from "@/server/redis/cache";

import GetUserRole from "@/app/components/server/GetUserRole";
import { Item } from "@/types";

type PageProps = { params: { id: string } };

export default async function ItemEditPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const isNewItem = rawId === "new";

  const userRole = await GetUserRole();

  if (userRole !== "ADMIN") {
    redirect(isNewItem ? `/downloads` : `/downloads/${rawId}`);
  }

  const authors = await prisma.authors.findMany({orderBy: { id: "asc" }});
  const moddingTeams = await prisma.moddingTeams.findMany({orderBy: { id: "asc" }});

  if (isNewItem) {
    return <ItemEditForm
      itemId="new"
      initialItem={null} 
      authors={authors}
      moddingTeams={moddingTeams} />;
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
  }) as Item;

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
