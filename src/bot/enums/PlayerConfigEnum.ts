import { MSG_PLAYER_CONFIGS } from '../constants/dictionary/dictionary';

enum PlayerConfigEnum {
  SAFETY = 'SAFETY',
  AIR_KICK = 'AIR_KICK',
  TEAM_CHAT = 'TEAM_CHAT',
}

export const PlayerConfigEnumExtension = {
  getName: function (_enum: PlayerConfigEnum): string | null {
    switch (_enum) {
      case PlayerConfigEnum.SAFETY:
        return MSG_PLAYER_CONFIGS.SAFETY;
      case PlayerConfigEnum.AIR_KICK:
        return MSG_PLAYER_CONFIGS.AIR_KICK;
      case PlayerConfigEnum.TEAM_CHAT:
        return MSG_PLAYER_CONFIGS.TEAM_CHAT;
      default:
        return null;
    }
  },
};

export default PlayerConfigEnum;
