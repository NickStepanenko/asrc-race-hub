import ItemEditForm from "./index";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import { getCached, setCached } from "@/server/redis/cache";

import GetUserRole from "@/app/components/server/GetUserRole";
import { Author, Item, ModdingTeam } from "@/types";

type PageProps = { params: { id: string } };

const getItem = async (id: number) => {
  const cacheKey = `downloads:v1:item-${id}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached as Item;

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

  await setCached(cacheKey, item);
  return item as Item;
}

const getAuthors = async () => {
  const cacheKey = `authors:v1`;
  const cached = await getCached(cacheKey);
  if (cached) return cached as Author[];

  const authors = await prisma.authors.findMany({orderBy: { id: "asc" }});
  await setCached(cacheKey, authors);
  return authors as Author[];
}

const getModdingTeams = async () => {
  const cacheKey = `moddingTeams:v1`;
  const cached = await getCached(cacheKey);
  if (cached) return cached as ModdingTeam[];

  const moddingTeams = await prisma.moddingTeams.findMany({orderBy: { id: "asc" }});
  await setCached(cacheKey, moddingTeams);
  return moddingTeams as ModdingTeam[];
}

export default async function ItemEditPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const isNewItem = rawId === "new";

  const userRole = await GetUserRole();

  if (userRole !== "ADMIN") {
    redirect(isNewItem ? `/downloads` : `/downloads/${rawId}`);
  }

  const authors = await getAuthors();
  const moddingTeams = await getModdingTeams();

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

  const item = await getItem(parsedId);

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
