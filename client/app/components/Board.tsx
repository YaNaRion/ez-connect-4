import { Paper, SimpleGrid } from "@mantine/core"
import Jeton from "./Jeton"
import useGameStore from "~/state/store"

const Board = () => {

  const board = useGameStore((state) => state.board)

  return (
    <Paper withBorder shadow="md" p="md" bg={"gray.2"}>
      <SimpleGrid cols={board.length} spacing="xs">
        {board.map((row, rowIndex) => (
          row.map((jeton, colIndex) => (
            <Jeton key={`${rowIndex}-${colIndex}`} {...jeton} lastCapture={jeton.lastCapture} coords={[rowIndex, colIndex]} />
          ))
        ))}
      </SimpleGrid>
    </Paper>
  )
}

export default Board
