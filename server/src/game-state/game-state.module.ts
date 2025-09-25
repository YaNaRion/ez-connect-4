import { Module } from '@nestjs/common';
import { GameStateService } from './game-state.service';

@Module({
  providers: [GameStateService],
})
export class GameStateModule {}
