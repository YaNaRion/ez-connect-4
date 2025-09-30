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
}

@WebSocketGateway({ cors: true })
export class EventsGateway {
  constructor(private readonly gameServer: GameStateService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('NOUVELLE CONNECTION');
    console.log('DANS CONNECT, UPDATE ALL TILE AVANT IF');
    if (this.gameServer.gameState == GAME_STATE.InGame) {
      console.log('DANS CONNECT, UPDATE ALL TILE');
      const dataGrid: DataTile[] = [];
      for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
          const tempData = this.gameServer.grid[i][j];
          const dataOUT: DataTile = {
            x: i,
            y: j,
            team: InverseTeamScores[tempData.currentTeam],
            lastCapture:
              this.gameServer.grid[i][j].lastTimeClaimed?.toISOString(),
          };
          dataGrid.push(dataOUT);
        }
      }

      const dataOUT = {
        array: dataGrid,
      };

      socket.emit(GameEvent.UPDATE_ALL_TIMER, dataOUT);
    }
  }

  @SubscribeMessage(GameEvent.START_GAME)
  handleStartGame(): void {
    this.gameServer.StartGame();
    this.server.emit(GameEvent.START_GAME);
  }

  @SubscribeMessage(GameEvent.END_GAME)
  handleEndGame(): void {
    this.gameServer.gameState = GAME_STATE.InGame;
    this.server.emit(GameEvent.END_GAME);
  }

  // Besoin body avec les coordonnees et lequipe de la tile qui change
  @SubscribeMessage(GameEvent.UPDATE_TILE)
  handleUpdateTile(socket: Socket, dataIN: DataTile): void {
    // Mettre les params de la requete
    console.log('DANS CONNECT, UPDATE TILE');
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

      // Formater le data grid
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

  // @SubscribeMessage(GameEvent.UPDATE_ALL_TIMER)
  // handleUpdateAllTile(socket: Socket): void {};
}
