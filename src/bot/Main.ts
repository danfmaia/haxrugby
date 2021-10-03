import 'reflect-metadata';
import { ContainerModule } from 'inversify';
import {
  IPlayerService,
  IRoomConfigObject,
  RoomHostBuilder,
  Types,
  IBackgroundTask,
  IChatMessageInterceptor,
  ChatMessage,
} from 'inversihax';
import { CustomPlayer } from './models/player/CustomPlayer';
import { CustomPlayerService } from './services/CustomPlayerService';
import { Startup } from './Startup';
import { InfoBackgroundTask } from './BackgroundTasks/InfoBackgroundTask';
import { ExecuteCommandInterceptor } from './interceptors/ExecuteCommandInterceptor';
import { HaxRugbyRoom } from './rooms/HaxRugbyRoom';
import { NewMatchCommand } from './commands/game/NewMatchCommand';
import { APP_VERSION, ROOM_TITLE } from './constants/constants';
import { ScoreCommand } from './commands/game/ScoreCommand';
import { LinksCommand } from './commands/links/LinksCommand';
import { AdminCommand } from './commands/admin/AdminCommand';
import { PasswordCommand } from './commands/admin/PasswordCommand';
import { RulesCommand } from './commands/rules/RulesCommand';
import { HelpCommand } from './commands/HelpCommand';
import { TryCommand } from './commands/rules/TryCommand';
import { FieldGoalCommand } from './commands/rules/FieldGoalCommand';
import { SafetyCommand } from './commands/rules/SafetyCommand';
import { DiscordCommand } from './commands/links/DiscordCommand';
import { FacebookCommand } from './commands/links/FacebookCommand';
import { SetScoreCommand } from './commands/game/SetScoreCommand';
import { KickerCommand } from './commands/conversion/KickerCommand';
import { GoalkeeperCommand } from './commands/conversion/GoalkeeperCommand';
import { PlaceBallCommand } from './commands/conversion/PlaceBallCommand';
import { ClearBanCommand } from './commands/admin/ClearBanCommand';

// List of all commands, must be here because using browserify to bundle everything for the browser and it needs the commands
// to be referenced at the very beginning in order for the command decorator to be able to apply the metadata to them
// TODO: maybe find a better way of bundling everything up for the browser, however, this is up to the user of the framework...
// PhysicsCommand;

HelpCommand;

AdminCommand;
PasswordCommand;
ClearBanCommand;

NewMatchCommand;
ScoreCommand;
SetScoreCommand;

KickerCommand;
GoalkeeperCommand;
PlaceBallCommand;

RulesCommand;
TryCommand;
FieldGoalCommand;
SafetyCommand;

LinksCommand;
DiscordCommand;
FacebookCommand;

const services = new ContainerModule((bind) => {
  bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({
    roomName: `${ROOM_TITLE} ${APP_VERSION}`,
    public: true,
    // password: 'WJ-wges!B3J)M/Tx',
    noPlayer: true,
    maxPlayers: 15,
  });

  bind<IPlayerService<CustomPlayer>>(Types.IPlayerService)
    .to(CustomPlayerService)
    .inSingletonScope();

  bind<IBackgroundTask>(Types.IBackgroundTask).to(InfoBackgroundTask).inSingletonScope();

  bind<IChatMessageInterceptor<ChatMessage<CustomPlayer>>>(Types.IChatMessageInterceptor)
    .to(ExecuteCommandInterceptor)
    .inRequestScope();
});

new RoomHostBuilder(Startup, HaxRugbyRoom, services).useCommands(true).buildAndRun();
