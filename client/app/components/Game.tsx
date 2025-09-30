import { Stack, Title } from "@mantine/core"
import Board from "./Board"
import type { Coordinates, Equipes } from "~/state/models"
import { useEffect } from "react"
import useGameStore from "~/state/store"
import { useSocket } from "~/provider/socket"


const exampleEquipes: Equipes = {
  red: { name: "Red", color: "red" },
  yellow: { name: "Yellow", color: "yellow" },
}

const exampleBoardState = [
  [{ name: "A1", owner: exampleEquipes.red }, { name: "A2", owner: exampleEquipes.yellow }, { name: "A3", owner: exampleEquipes.red }],
  [{ name: "B1", owner: exampleEquipes.yellow }, { name: "B2", owner: exampleEquipes.red }, { name: "B3", owner: exampleEquipes.yellow }],
  [{ name: "C1" }, { name: "C2" }, { name: "C3" }],
]

export enum GameEvent {
  START_GAME = 'StartGame',
  END_GAME = 'EndGame',
  UPDATE_TILE = 'UpdateTile',
  UPDATE_TILE_ERR = 'UpdateTileErr',
  UPDATE_ALL_TIMER = 'UpdateAllTimer',
}

const Game = () => {
  // const board = useGameStore((state) => state.board)
  const { socket } = useSocket();

  const reset = useGameStore((state) => state.reset)
  const claim = useGameStore((state) => state.claim)
  // const clearClaim = useGameStore((state) => state.clearClaim)

  // setSocket(newSocket);
  useEffect(() => {
    if (socket) {

      socket.on(GameEvent.END_GAME, () => {
        reset();
      });

      socket.on(GameEvent.UPDATE_TILE, (data: any) => {
        const coord: Coordinates = [data.x, data.y];
        claim(coord, data.team, new Date(data.lastCapture));
      });

      socket.on(GameEvent.UPDATE_ALL_TIMER, (data: any) => {
        for (let i = 0; i < 25; ++i) {
          const coord: Coordinates = [data.array[i].x, data.array[i].y];
          claim(coord, data.array[i].team, new Date(data.array[i].lastCapture));
        }
      });
    }
  }, []);

  const StartGameButton = () => {
    if (socket) {
      socket.emit(GameEvent.START_GAME);
    }
  };

  const ResetGameButton = () => {
    if (socket) {
      socket.emit(GameEvent.END_GAME);
    }
  };

  return (
    <Stack>
      <Title order={2}>Grand jeu Connect4 Anims 2025</Title>
      <button onClick={StartGameButton}> StartGameButton</button>
      <button onClick={ResetGameButton}> ResetGameButton</button>
      <Board />
    </Stack >
  )
}

export default Game
