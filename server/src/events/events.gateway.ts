import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  GameStateService,
  GAME_STATE,
  TEAM,
  ERR_TILE_IS_PROTECTED,
} from 'src/game-state/game-state.service';
import { Server, Socket } from 'socket.io';

export enum GameEvent {
  START_GAME = 'StartGame',
  END_GAME = 'EndGame',
  UPDATE_TILE = 'UpdateTile',
  UPDATE_TILE_ERR = 'UpdateTileErr',
  UPDATE_ALL_TIMER = 'UpdateAllTimer',
  GET_GAME_STATE = 'GetGameState',
  RESET_GAME = 'ResetGame',
}

const TeamScores: Record<string, TEAM> = {
  NONE: TEAM.NONE,
  rouges: TEAM.RED,
  bleus: TEAM.BLUE,
  verts: TEAM.GREEN,
  jaunes: TEAM.YELLOW,
};

const InverseTeamScores: Record<TEAM, string> = {
  [TEAM.NONE]: 'NONE',
  [TEAM.RED]: 'rouges',
  [TEAM.BLUE]: 'bleus',
  [TEAM.GREEN]: 'verts',
  [TEAM.YELLOW]: 'jaunes',
};

interface DataTile {
  x: number;
  y: number;
  team: string;
  lastCapture?: string;
  game_state?: GAME_STATE;
}

@WebSocketGateway({ cors: true })
export class EventsGateway {
  constructor(private readonly gameServer: GameStateService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    if (this.gameServer.gameState == GAME_STATE.InGame) {
      const dataGrid: DataTile[] = [];
      for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
          const tempData = this.gameServer.grid[i][j];
          const dataOUT: DataTile = {
            x: i,
            y: j,
            team: InverseTeamScores[tempData.currentTeam],
            lastCapture: tempData.lastTimeClaimed?.toISOString(),
            game_state: this.gameServer.gameState,
          };
          dataGrid.push(dataOUT);
        }
      }

      const dataOUT = {
        array: dataGrid,
        game_state: this.gameServer.gameState,
      };

      socket.emit(GameEvent.UPDATE_ALL_TIMER, dataOUT);
    }
  }

  @SubscribeMessage(GameEvent.UPDATE_ALL_TIMER)
  handlerUpdateALl(socket: Socket) {
    if (this.gameServer.gameState == GAME_STATE.InGame) {
      const dataGrid: DataTile[] = [];
      for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
          const tempData = this.gameServer.grid[i][j];
          const dataOUT: DataTile = {
            x: i,
            y: j,
            team: InverseTeamScores[tempData.currentTeam],
            lastCapture: tempData.lastTimeClaimed?.toISOString(),
            game_state: this.gameServer.gameState,
          };
          dataGrid.push(dataOUT);
        }
      }

      const dataOUT = {
        array: dataGrid,
        game_state: this.gameServer.gameState,
      };

      socket.emit(GameEvent.UPDATE_ALL_TIMER, dataOUT);
    }
  }

  @SubscribeMessage(GameEvent.START_GAME)
  handleStartGame(): void {
    this.gameServer.StartGame();
    this.server.emit(GameEvent.START_GAME, {
      game_state: this.gameServer.gameState,
    });
  }

  @SubscribeMessage(GameEvent.END_GAME)
  handleEndGame(): void {
    this.gameServer.EndGame();
    this.server.emit(GameEvent.END_GAME);
  }

  @SubscribeMessage(GameEvent.RESET_GAME)
  handleResetGame(): void {
    this.gameServer.ResetGame();
    const dataGrid: DataTile[] = [];
    for (let i = 0; i < 5; ++i) {
      for (let j = 0; j < 5; ++j) {
        const tempData = this.gameServer.grid[i][j];
        const dataOUT: DataTile = {
          x: i,
          y: j,
          team: InverseTeamScores[tempData.currentTeam],
          lastCapture: tempData.lastTimeClaimed?.toISOString(),
          game_state: this.gameServer.gameState,
        };
        dataGrid.push(dataOUT);
      }
    }

    const dataOUT = {
      array: dataGrid,
      game_state: this.gameServer.gameState,
    };
    this.server.emit(GameEvent.UPDATE_ALL_TIMER, dataOUT);
    this.server.emit(GameEvent.RESET_GAME);
  }

  @SubscribeMessage(GameEvent.UPDATE_TILE)
  handleUpdateTile(socket: Socket, dataIN: DataTile): void {
    if (this.gameServer.gameState != GAME_STATE.InGame) {
      return;
    }
    const x_index: number = dataIN.x;
    const y_index: number = dataIN.y;
    const teamColor: string = dataIN.team;

    try {
      this.gameServer.ChangeTileTeam(TeamScores[teamColor], x_index, y_index);
      const dataOUT: DataTile = {
        x: x_index,
        y: y_index,
        team: dataIN.team,
        lastCapture:
          this.gameServer.grid[x_index][y_index].lastTimeClaimed?.toISOString(),
      };

      this.server.emit(GameEvent.UPDATE_TILE, dataOUT);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == ERR_TILE_IS_PROTECTED) {
          console.log(error.message);
          socket.emit(GameEvent.UPDATE_TILE_ERR, error.message);
        }
      }
    }
  }
}
