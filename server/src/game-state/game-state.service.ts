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
  GREEN,
  YELLOW,
}

const THIRTY_MINUTES_MS: number = 30 * 60 * 1000;
const GRID_SIZE: number = 5;

// Pour une game de deux heures
export const GAME_DURATION_MS: number = THIRTY_MINUTES_MS * 4;
export const ERR_TILE_IS_PROTECTED: string = 'The tile is protected';

export class Tile {
  public currentTeam: TEAM;
  public isProtected: boolean;
  public lastTimeClaimed?: Date;

  constructor() {
    this.currentTeam = TEAM.NONE;
    this.isProtected = false;
  }

  ChangeTeam(newTeam: TEAM) {
    if (!this.isProtected) {
      this.currentTeam = newTeam;
      this.isProtected = true;
      this.lastTimeClaimed = new Date();
      setTimeout(() => {
        this.isProtected = false;
      }, THIRTY_MINUTES_MS);
    } else {
      throw new Error(ERR_TILE_IS_PROTECTED);
    }
  }
}

@Injectable()
export class GameStateService {
  gameState: GAME_STATE;
  public grid: Tile[][];
  public endTimer: Date;

  constructor() {
    this.gameState = GAME_STATE.Lobby;
    this.grid = [[]];
    for (let i = 0; i < GRID_SIZE; ++i) {
      this.grid.push([]);
      for (let j = 0; j < GRID_SIZE; ++j) {
        this.grid[i].push(new Tile());
      }
    }
  }

  StartGame() {
    this.endTimer = new Date(Date.now() + GAME_DURATION_MS);
    this.gameState = GAME_STATE.InGame;
  }

  EndGame() {
    this.gameState = GAME_STATE.EndGame;
  }

  ChangeGameState(newGameState: GAME_STATE) {
    this.gameState = newGameState;
  }

  ChangeTileTeam(newTeam: TEAM, x: number, y: number) {
    this.grid[x][y].ChangeTeam(newTeam);
  }
}
