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
