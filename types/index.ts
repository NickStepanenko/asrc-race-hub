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
  id: string;
  name: string;
  type: string;
  carClass: string;
  image: string;
  logo: string;
  url: string;
  released: boolean
  releaseDate: Date;
  updateDate: Date;
};

export type ButtonConfig = {
  colorBkg?: string;
  colorText: string;
  buttonType: "primary" | "dashed" | "link" | "text" | "default" | undefined;
  buttonVariant: "dashed" | "link" | "text" | "solid" | "outlined" | "filled" | undefined;
  text: string;
  icon: React.ReactElement;
};
