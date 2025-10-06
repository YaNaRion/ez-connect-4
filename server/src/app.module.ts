import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { GameStateService } from './game-state/game-state.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsGateway, GameStateService],
})
export class AppModule {}
