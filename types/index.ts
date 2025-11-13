// types/index.ts
export type Styles = {
  [key: string]: React.CSSProperties;
};

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
  carClass: string;
  image?: string | null;
  logo?: string | null;
  url?: string | null;
  released: boolean;
  releaseDate?: Date | string | null | undefined;
  features?: unknown | null | undefined;
  specs?: unknown | null | undefined;
  screenshots?: unknown | null | undefined;
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

export type FormattedAuthorsList = {
  [key: string]: Author[];
};
