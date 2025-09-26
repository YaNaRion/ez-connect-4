import { Stack, Title } from "@mantine/core"
import Board from "./Board"
import type { Equipes } from "~/state/models"


const exampleEquipes: Equipes = {
  red: { name: "Red", color: "red" },
  yellow: { name: "Yellow", color: "yellow" },
}

const exampleBoardState = [
  [{name: "A1", owner: exampleEquipes.red}, {name: "A2", owner: exampleEquipes.yellow}, {name: "A3", owner: exampleEquipes.red}],
  [{name: "B1", owner: exampleEquipes.yellow}, {name: "B2", owner: exampleEquipes.red}, {name: "B3", owner: exampleEquipes.yellow}],
  [{name: "C1"}, {name: "C2"}, {name: "C3"}],
]


const Game = () => {

  return (
    <Stack>
      <Title order={2}>Grand jeu Connect4 Anims 2025</Title>
      <Board />
    </Stack>
  )
}

export default Game