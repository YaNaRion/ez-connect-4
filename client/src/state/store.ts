import { create } from "zustand";
import { combine } from "zustand/middleware";
import type { Coordinates, GameState } from "./models";

const defaultState: GameState = {
  equipes: {
    rouges: { name: "Rouges", color: "red" },
    jaunes: { name: "Jaunes", color: "yellow" },
    bleus: { name: "Bleus", color: "blue" },
    verts: { name: "Verts", color: "green" },
  },
  board: [
    [
      { name: "Marché Atwater" },
      { name: "Anneau" },
      { name: "Bas. Notre-Dame" },
      { name: "Canal Lachine" },
      { name: "Le Central" },
    ],
    [
      { name: "Centre des sciences" },
      { name: "CHUM" },
      { name: "Éva B" },
      { name: "McGill U." },
      { name: "Henri-Dunant Gym" },
    ],
    [
      { name: "Gésu" },
      { name: "Av. Canadiens" },
      { name: "Local Scout" },
      { name: "Grande Roue" },
      { name: "ÉTS" },
    ],
    [
      { name: "Grande Bilbio" },
      { name: "Musée des B.-A." },
      { name: "Palais des congrès" },
      { name: "Pointe-à-Callières" },
      { name: "Quartier Chinois" },
    ],
    [
      { name: "Resto Helena" },
      { name: "Quartier des Spectacles" },
      { name: "Uni. Concordia" },
      { name: "Espace Rodier" },
      { name: "Le Village" },
    ],
  ],
  claimCooldownMinutes: 30,
};

const useGameStore = create(
  combine(defaultState, (set) => ({
    reset: () => set(() => defaultState),
    claim: (coords: Coordinates, equipeKey: string, lastCapture: Date) =>
      set((state) => {
        if (equipeKey in state.equipes) {
          const newBoard = state.board.map((row) =>
            row.map((jeton) => ({ ...jeton })),
          );
          const [row, col] = coords;
          newBoard[row][col].owner = state.equipes[equipeKey];
          newBoard[row][col].lastCapture = lastCapture;
          return { board: newBoard };
        } else return { board: state.board };
      }),
    resetATile: (coords: Coordinates) =>
      set((state) => {
        const newBoard = state.board.map((row) =>
          row.map((jeton) => ({ ...jeton })),
        );
        const [row, col] = coords;
        newBoard[row][col].owner = undefined;
        newBoard[row][col].lastCapture = undefined;
        return { board: newBoard };
      }),
    clearClaim: (coords: Coordinates) =>
      set((state) => {
        const newBoard = state.board.map((row) => row.map((jeton) => jeton));
        const [row, col] = coords;
        newBoard[row][col].owner = undefined;
        newBoard[row][col].lastCapture = undefined;
        return { board: newBoard };
      }),
  })),
);

export default useGameStore;
