import { Stack, Title } from "@mantine/core"
import Board from "./Board"
import type { Coordinates, Equipes } from "../state/models"
import { useEffect, useState } from "react"
import useGameStore from "../state/store"
import { useSocket } from "../provider/socket"
import { useSearchParams } from "react-router-dom";


export enum GameEvent {
  START_GAME = 'StartGame',
  END_GAME = 'EndGame',
  UPDATE_TILE = 'UpdateTile',
  UPDATE_TILE_ERR = 'UpdateTileErr',
  UPDATE_ALL_TIMER = 'UpdateAllTimer',
  GET_GAME_STATE = "GetGameState",
  RESET_GAME = 'ResetGame',
  CLEAR_CLAIM = 'ClearClaim',
}

const adminPass = "leboss420"

export enum GAME_STATE {
  Lobby = 'La partie est en attente de commencer',
  InGame = 'La partie est commencée',
  EndGame = 'La partie est finit',
}


const Game = () => {
  const { socket } = useSocket();

  const reset = useGameStore((state) => state.reset)
  const claim = useGameStore((state) => state.claim)
  const [gameState, setGameState] = useState<GAME_STATE>(GAME_STATE.Lobby);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (socket) {
      const mode = searchParams.get("mode");
      if (mode && mode === adminPass) {
        setIsAdmin(true)
      }
      if (isAdmin) {
        socket.on(GameEvent.RESET_GAME, () => {
          setGameState(GAME_STATE.Lobby)
          reset();
        });

        socket.on(GameEvent.END_GAME, () => {
          setGameState(GAME_STATE.EndGame)
        });

        socket.on(GameEvent.START_GAME, (data: any) => {
          if (data.game_state = 1) {
            setGameState(GAME_STATE.InGame);
          }
        });
      }

      socket.on(GameEvent.UPDATE_TILE, (data: any) => {
        const coord: Coordinates = [data.x, data.y];
        claim(coord, data.team, new Date(data.lastCapture));
        const alert_string = `L'équipe ${data.team} à prossession de la case (${coord[0] + 1}, ${coord[1] + 1})`
        console.log("JUSETE AVANT ALERT")
        alert(alert_string);
      });

      socket.on(GameEvent.UPDATE_ALL_TIMER, (data: any) => {
        for (let i = 0; i < 25; ++i) {
          const coord: Coordinates = [data.array[i].x, data.array[i].y];
          claim(coord, data.array[i].team, new Date(data.array[i].lastCapture));
        }
        if (data.game_state = 1) {
          setGameState(GAME_STATE.InGame);
        }
      });

      socket.emit(GameEvent.UPDATE_ALL_TIMER);
      return () => {
        socket.off(GameEvent.RESET_GAME);
        socket.off(GameEvent.END_GAME);
        socket.off(GameEvent.START_GAME);
        socket.off(GameEvent.UPDATE_TILE);
        socket.off(GameEvent.UPDATE_ALL_TIMER);
        socket.off(GameEvent.START_GAME);
      };
    };
  }, []);

  const StartGameButton = () => {
    if (socket) {
      socket.emit(GameEvent.START_GAME);
    }
  };

  const ResetGameButton = () => {
    if (socket) {
      socket.emit(GameEvent.RESET_GAME);
    }
  };

  return (
    <Stack>
      <Title order={2}>Grand jeu Connect4 Anims 2025</Title>
      <h1>ÉTAT DE LA PARTIE: {gameState}</h1>
      {isAdmin && (
        <>
          <button onClick={StartGameButton}>Start</button>
          <button onClick={ResetGameButton}>Reset</button>
        </>
      )}< Board isAdmin={isAdmin} /> </Stack >
  )
}

export default Game