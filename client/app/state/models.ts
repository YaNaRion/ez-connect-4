export type JetonState = "free" | "yellow" | "empty";
export type Coordinates = [number, number];

export interface Equipe {
  name: string;
  color: "yellow" | "red" | "blue" | "green";
}

export interface Equipes {
  [string: string]: Equipe;
}

export interface JetonModel {
  owner?: Equipe;
  lastCapture?: Date;
  name: string;
}

export interface BoardModel {
  board: JetonModel[][];
}

export interface GameState {
  equipes: Equipes;
  board: JetonModel[][];
  claimCooldownMinutes: number;
}
