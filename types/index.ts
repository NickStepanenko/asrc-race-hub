// types/index.ts

// User
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type Styles = {
  [key: string]: React.CSSProperties;
};

// Online racing
export type Championship = {
  id: number;
  title: string;
  logo: string;
  serverName: string;
  serverPass: string;
  leagueJoinQr: string;
  cars: Car[];
  races: Race[];
};
export type Car = {
  carNumber: number;
  driverFirstName: string;
  driverLastName: string;
  teamName: string;
  teamLogo: string;
  carImage: string;
  flagImage: string;
};
export type Race = {
  id: number;
  name: string;
  round: number;
  laps: number;
  mins: number;
  tyres: [string];
  trackMap: string;
  trackLogo: string;
  raceDateTime: string;
};

export type ChampionshipsListItem = {
  value: number | null;
  label: React.ReactElement;
};
export type RacesListItem = {
  value: number | null;
  label: React.ReactElement;
};
export type SpotterProps = {
  selectedChamp: Championship | null;
  selectedRace: Race | null;
};

// Downloads
export type Item = {
  id: number;
  name: string;
  type: string;
  description: string;
  carClass: string;
  image?: string | null;
  logo?: string | null;
  url?: string | null;
  templatesUrl?: string | null;
  setupsUrl?: string | null;
  released: boolean;
  releaseDate?: Date | string | null | undefined;
  features?: unknown | null | undefined;
  specs?: unknown | null | undefined;
  metadata?: unknown | null | undefined;
  screenshots?: unknown | null | undefined;
  authors: ItemAuthor[];
  authorTeams: ModItemsModdingTeams[];
};

export type ItemSpecs = {
  [key: string]: string;
};

export type ButtonConfig = {
  colorBkg?: string;
  colorText: string;
  buttonType: "primary" | "dashed" | "link" | "text" | "default" | undefined;
  buttonVariant: "dashed" | "link" | "text" | "solid" | "outlined" | "filled" | undefined;
  text: string;
  icon: React.ReactElement;
};

export type ItemAuthor = {
  id: number;
  itemId: number | null;
  authorId: number | null;
  role: string;
  author: Author;
};

export type Author = {
  id: number;
  name: string | null;
  url: string | null;
};

export type ModdingTeam = {
  id: number;
  name: string | null;
  shortName: string | null;
  logo: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  url: string | null;
};

export type ModItemsModdingTeams = {
  id: number;
  itemId: number;
  teamId: number;
  team: ModdingTeam;
};

export type FormattedAuthorsList = {
  [key: string]: Author[];
};
