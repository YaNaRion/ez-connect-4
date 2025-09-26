import { create } from "zustand"
import { combine } from "zustand/middleware"
import type { Coordinates, GameState } from "./models"

const defaultState: GameState  = {
  equipes: {
    rouge: { name: "Rouges", color: "red" },
    jaune: { name: "Jaunes", color: "yellow" },
    bleus: { name: "Bleus", color: "blue" },
    verts: { name: "Verts", color: "green" },
  },
  board: [
    [{name: "A1"}, {name: "A2"}, {name: "A3"}, {name: "A4"}, {name: "A5"}],
    [{name: "B1"}, {name: "B2"}, {name: "B3"}, {name: "B4"}, {name: "B5"}],
    [{name: "C1"}, {name: "C2"}, {name: "C3"}, {name: "C4"}, {name: "C5"}],
    [{name: "D1"}, {name: "D2"}, {name: "D3"}, {name: "D4"}, {name: "D5"}],
    [{name: "E1"}, {name: "E2"}, {name: "E3"}, {name: "E4"}, {name: "E5"}]
  ],
  claimCooldownMinutes: 5
}

const useGameStore = create(
  combine(
    defaultState, 
    (set) => ({
      reset: () => set(() => (defaultState)),
      claim: (coords: Coordinates, equipeKey: string) => set((state) => {
        if(equipeKey in state.equipes) {
          const newBoard = state.board.map((row) => row.map((jeton) => ({...jeton})))
          const [row, col] = coords
          newBoard[row][col].owner = state.equipes[equipeKey]
          newBoard[row][col].lastCapture = new Date()
          return { board: newBoard }
        }
        else return {board: state.board}
      }),
      clearClaim: (coords: Coordinates) => set(
        (state) => {
          const newBoard = state.board.map((row) => row.map((jeton) => jeton))
          const [row, col] = coords
          newBoard[row][col].owner = undefined
          newBoard[row][col].lastCapture = undefined
          return { board: newBoard }
      })
    })
  )
)

export default useGameStore