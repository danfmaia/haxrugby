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
import { CustomPlayer } from './models/CustomPlayer';
import { CustomPlayerService } from './services/CustomPlayerService';
import { Startup } from './Startup';
import { InfoBackgroundTask } from './BackgroundTasks/InfoBackgroundTask';
import { ExecuteCommandInterceptor } from './Interceptors/ExecuteCommandInterceptor';
import { HaxRugbyRoom } from './rooms/HaxRugbyRoom';
import { NewMatchCommand } from './Commands/NewMatchCommand';
import { APP_VERSION } from './constants/constants';
import { ScoreCommand } from './Commands/ScoreCommand';
import { LinksCommand } from './Commands/LinksCommand';
import { AdminCommand } from './Commands/AdminCommand';
import { PasswordCommand } from './Commands/PasswordCommand';
import { RulesCommand } from './Commands/RulesCommand';
import { HelpCommand } from './Commands/HelpCommand';

// List of all commands, must be here because using browserify to bundle everything for the browser and it needs the commands
// to be referenced at the very beginning in order for the command decorator to be able to apply the metadata to them
// TODO: maybe find a better way of bundling everything up for the browser, however, this is up to the user of the framework...

// PhysicsCommand;
HelpCommand;
RulesCommand;
NewMatchCommand;
ScoreCommand;
LinksCommand;
AdminCommand;
PasswordCommand;

const services = new ContainerModule((bind) => {
  bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({
    playerName: 'HaxRugby®',
    roomName: `HaxRugby® by JP v${APP_VERSION} - Desenvolvendo`,
    public: true,
    password: 'WJ-wges!B3J)M/Tx',
    noPlayer: false,
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
