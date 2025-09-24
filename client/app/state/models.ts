
export type JetonState = "free" | "yellow" | "empty";

export interface Equipe {
  name: string;
  color: "yellow" | "red" | "blue" | "green";
}

export interface Jeton {
  owner?: Equipe;
  lastCapture?: Date;
}