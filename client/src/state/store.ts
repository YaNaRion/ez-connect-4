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
      { name: "Marché Atwater" , defi:"Prendre en photo la plus belle courge"},
      { name: "Anneau", defi:"Prendre une photo concept avec l'anneau" },
      { name: "Basilique Notre-Dame", defi:"Photo pieuse devant la basilique" },
      { name: "Canal Lachine", defi:"Prendre une photo avec tous les membres dans laquelle on voit le logo de Farine Five Roses"},
      { name: "Le Central", defi:"Photo du resto qui vous semble le meilleur"},
    ],
    [
      { name: "Centre des sciences", defi:"Prendre une photo avec toutes léquipe sur les boules rouges" },
      { name: "CHUM", defi:"Prendre une photo ou on voit le logo du CHUM" },
      { name: "Éva B", defi:"Prendre une photo de ce qu’il y a au balcon en haut" },
      { name: "McGill U.", defi:"Prendre une photo en panorama dans les arches" },
      { name: "Henri-Dunant Gym", defi:"Prendre une photo de vous qui faites du sport" },
    ],
    [
      { name: "Gésu", defi:"Prendre une photo de l’horaire des représentations" },
      { name: "Av. Canadiens", defi:"photo avec Maurice Richard" },
      { name: "Parc Oscar Peterson", defi:"Vidéo d’équipe de 30 secondes de jazz ininterrompu en nature" },
      { name: "Grande Roue", defi:"Photo instagram 2016" },
      { name: "ÉTS", defi:"Imitez des étudiants de l’ETS" },
    ],
    [
      { name: "Grande Bilbio", defi:"Photo studieuse"},
      { name: "Musée des Beaux-Arts", defi:"Prendre une photo avec les coeurs"},
      { name: "Palais des Congrès", defi:"Prendre une photo de l’équipe avec le mur des couleurs"},
      { name: "Pointe-à-Callières", defi:"Prendre une photo du musée Pointe à Callière" },
      { name: "Quartier Chinois", defi:"Prendre une photo d’équipe sous une arche du quartier"},
    ],
    [
      { name: "Resto Helena", defi:"Photo du menu" },
      { name: "Quartier des Spectacles", defi:"Prendre une photo d’équipe devant la salle Wilfrid Pelletier " },
      { name: "Uni. Concordia", defi:"Prendre une photo devant le pavillon Henry F. Hall" },
      { name: "Espace Rodier", defi:"Photo concept post-moderne" },
      { name: "Le Village", defi:"Prendre 2 murales en photo" },
    ],
  ],
  claimCooldownMinutes: 30,
  permissionsAllowed: false
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
    setPermissionsAllowed: (allowed: boolean) => set(() => ({ permissionsAllowed: allowed })),
  })),
);

export default useGameStore;
