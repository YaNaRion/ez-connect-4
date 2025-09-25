import { Injectable } from '@nestjs/common';

export enum GAME_STATE {
  Lobby,
  InGame,
  EndGame,
}

export enum TEAM {
  NONE,
  RED,
  BLUE,
  GREED,
  YELLOW,
}

const THIRTY_MINUTES_MS: number = 30 * 60 * 1000;

// Pour une game de deux heures
const GAME_DURATION_MS: number = THIRTY_MINUTES_MS * 4;
export const ERR_TILE_IS_PROTECTED: string = 'The tile is protected';

export class Tile {
  public currentTeam: TEAM;
  public isProtected: boolean;
  public endTimer: Date;

  constructor() {}
  ChangeTeam(newTeam: TEAM) {
    if (this.isProtected) {
      this.currentTeam = newTeam;
      this.isProtected = true;
      this.endTimer = new Date(Date.now() + THIRTY_MINUTES_MS);
      setTimeout(() => {
        this.isProtected = false;
      }, THIRTY_MINUTES_MS);
    } else {
      throw new Error(ERR_TILE_IS_PROTECTED);
    }
  }
}

export class GameBoard {
  public grid: Tile[][];
  public endTimer: Date;
}

@Injectable()
export class GameStateService {
  gameState: GAME_STATE;
  gameBoard: GameBoard;

  constructor() {
    this.gameState = GAME_STATE.Lobby;
  }

  StartGame() {
    this.gameBoard.endTimer = new Date(Date.now() + GAME_DURATION_MS);
    this.gameState = GAME_STATE.InGame;
  }

  ChangeGameState(newGameState: GAME_STATE) {
    this.gameState = newGameState;
  }
}
