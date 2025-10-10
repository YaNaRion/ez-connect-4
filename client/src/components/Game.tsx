import { Stack, Title } from "@mantine/core"
import Board from "./Board"


const Game = () => {

  return (
    <Stack>
      <Title order={2}>Grand jeu Connect4 Anims 2025</Title>
      <Board />
    </Stack>
  )
}

export default Game