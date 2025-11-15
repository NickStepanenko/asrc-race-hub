import ItemEditForm from "./index";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import GetUserRole from "@/app/components/GetUserRole";

type PageProps = { params: { id: string } };

export default async function ItemEditPage({ params }: PageProps) {
  const rawId = await params.id;
  const isNewItem = rawId === "new";

  const userRole = await GetUserRole();

  if (userRole !== "ADMIN") {
    redirect(isNewItem ? `/downloads` : `/downloads/${rawId}`);
  }

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
  
  if (!item) {
    notFound();
  }

  const authors = await prisma.authors.findMany({orderBy: { id: "asc" }});
  const moddingTeams = await prisma.moddingTeams.findMany({orderBy: { id: "asc" }});

  return <ItemEditForm
    itemId={rawId}
    initialItem={item}
    authors={authors}
    moddingTeams={moddingTeams}
  />;
}
