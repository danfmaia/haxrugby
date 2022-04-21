import { MSG_PLAYER_CONFIGS } from '../constants/dictionary/dictionary';

enum PlayerConfigEnum {
  SAFETY = 'SAFETY',
  AIR_KICK = 'AIR_KICK',
}

export const PlayerConfigEnumExtension = {
  getName: function (_enum: PlayerConfigEnum) {
    switch (_enum) {
      case PlayerConfigEnum.SAFETY:
        return MSG_PLAYER_CONFIGS.SAFETY;
      case PlayerConfigEnum.AIR_KICK:
        return MSG_PLAYER_CONFIGS.AIR_KICK;
    }
  },
};

export default PlayerConfigEnum;
