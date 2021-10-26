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
import { HaxRugbyPlayer } from './models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerService } from './services/HaxRugbyPlayerService';
import { Startup } from './Startup';
import { InfoBackgroundTask } from './BackgroundTasks/InfoBackgroundTask';
import { ExecuteCommandInterceptor } from './interceptors/ExecuteCommandInterceptor';
import { HaxRugbyRoom } from './rooms/HaxRugbyRoom';
import { NewMatchCommand } from './commands/match/NewMatchCommand';
import {
  APP_VERSION_IN_ROOM_LIST,
  CLOSED_PLAYER_NAME,
  CLOSED_ROOM_TITLE,
  ROOM_TITLE,
} from './constants/constants';
import { ScoreCommand } from './commands/match/ScoreCommand';
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
import { SetScoreCommand } from './commands/match/SetScoreCommand';
import { KickerCommand } from './commands/conversion/KickerCommand';
import { GoalkeeperCommand } from './commands/conversion/GoalkeeperCommand';
import { BallCommand } from './commands/conversion/BallCommand';
import { ClearBanCommand } from './commands/admin/ClearBanCommand';
import { LeaveCommand } from './commands/LeaveCommand';
import { CancelMatchCommand } from './commands/match/CancelMatchCommand';
import { OnlyAdminCommand } from './commands/admin/OnlyAdminCommand';
import { KickRateLimitCommand } from './commands/physics/KickRateLimitCommand';
import { AirKickCommand } from './commands/AirKickCommand';
import { AirKickRuleCommand } from './commands/rules/AirKickRuleCommand';
import { AdvantageCommand } from './commands/penalty/AdvantageCommand';
import { OffsideCommand } from './commands/rules/OffsideCommand';
import { PenaltyCommand } from './commands/penalty/PenaltyCommand';
import { PenaltyRuleCommand } from './commands/rules/PenaltyRuleCommand';
import appConfig from './constants/appConfig';
import { FilterInterceptor } from './interceptors/FilterInterceptor';

// List of all commands, must be here because using browserify to bundle everything for the browser and it needs the commands
// to be referenced at the very beginning in order for the command decorator to be able to apply the metadata to them
// TODO: maybe find a better way of bundling everything up for the browser, however, this is up to the user of the framework...
// PhysicsCommand;

HelpCommand;
LeaveCommand;

AdminCommand;
PasswordCommand;
ClearBanCommand;
OnlyAdminCommand;

NewMatchCommand;
CancelMatchCommand;
ScoreCommand;
SetScoreCommand;

AirKickCommand;
KickerCommand;
GoalkeeperCommand;
BallCommand;
AdvantageCommand;
PenaltyCommand;

RulesCommand;
TryCommand;
FieldGoalCommand;
AirKickRuleCommand;
SafetyCommand;
OffsideCommand;
PenaltyRuleCommand;

LinksCommand;
DiscordCommand;
FacebookCommand;

KickRateLimitCommand;

const roomName = appConfig.isOpen ? `${ROOM_TITLE} ${APP_VERSION_IN_ROOM_LIST}` : CLOSED_ROOM_TITLE;

const services = new ContainerModule((bind) => {
  bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({
    roomName,
    playerName: CLOSED_PLAYER_NAME,
    public: false,
    // password: 'WJ-wges!B3J)M/Tx',
    noPlayer: appConfig.isOpen,
    maxPlayers: 15,
    // token: 'thr1.AAAAAGF1yoyfzb1jFbcUvw.X_RZsWLMO-I',
  });

  bind<IPlayerService<HaxRugbyPlayer>>(Types.IPlayerService)
    .to(HaxRugbyPlayerService)
    .inSingletonScope();

  bind<IBackgroundTask>(Types.IBackgroundTask).to(InfoBackgroundTask).inSingletonScope();

  bind<IChatMessageInterceptor<ChatMessage<HaxRugbyPlayer>>>(Types.IChatMessageInterceptor)
    .to(ExecuteCommandInterceptor)
    .inRequestScope();

  bind<IChatMessageInterceptor<ChatMessage<HaxRugbyPlayer>>>(Types.IChatMessageInterceptor)
    .to(FilterInterceptor)
    .inRequestScope();
});

new RoomHostBuilder(Startup, HaxRugbyRoom, services).useCommands(true).buildAndRun();
