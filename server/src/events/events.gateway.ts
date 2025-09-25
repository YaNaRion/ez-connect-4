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

@WebSocketGateway({ cors: true })
export class EventsGateway {
  constructor(private readonly gameServer: GameStateService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(): string {
    return 'Hello world!';
  }

  @SubscribeMessage(GameEvent.START_GAME)
  handleStartGame(): void {
    this.gameServer.gameState = GAME_STATE.InGame;
    this.gameServer.StartGame();
    this.server.emit('GameEvent.START_GAME');
  }

  @SubscribeMessage(GameEvent.END_GAME)
  handleEndGame(): void {
    this.gameServer.gameState = GAME_STATE.InGame;
    this.server.emit(GameEvent.END_GAME);
  }

  // Besoin body avec les coordonnees et lequipe de la tile qui change
  @SubscribeMessage(GameEvent.UPDATE_TILE)
  handleUpdateTile(socket: Socket /*@MessageBody data: Body*/): void {
    // Mettre les params de la requete
    const x_index = 0;
    const y_index = 0;
    const teamColor = TEAM.RED;

    try {
      this.gameServer.gameBoard.grid[x_index][y_index].ChangeTeam(teamColor);
      const data = this.gameServer.gameBoard.grid[x_index][y_index];

      // Formater le data grid
      this.server.emit(GameEvent.UPDATE_TILE, data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == ERR_TILE_IS_PROTECTED) {
          console.log(error.message);
          socket.emit(GameEvent.UPDATE_TILE_ERR, error.message);
        }
      }
    }
  }

  @SubscribeMessage(GameEvent.UPDATE_ALL_TIMER)
  handleUpdateAllTile(/*@MessageBody data: Body*/): void {
    const gameBoard = this.gameServer;
    // Ajouter ce data brodcast:
    // @Date de fin de tous les timer
    // @Date de fin de la partie
    // @Status de toutes les tiles
    // @Status de la partie
    this.server.emit(GameEvent.UPDATE_ALL_TIMER, gameBoard);
  }
}
