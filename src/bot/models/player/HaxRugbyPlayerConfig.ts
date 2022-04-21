import { HaxRugbyRole } from './HaxRugbyRole';

export class HaxRugbyPlayerConfig {
  public static configs: HaxRugbyPlayerConfig[] = [];

  public playerId: number;
  public role: HaxRugbyRole;
  public canBeTheOnlyAdmin: boolean = true;

  public isAirKickEnabled: boolean = true;
  public isSafetyEnabled: boolean = true;

  constructor(playerId: number) {
    this.playerId = playerId;
    this.role = HaxRugbyRole.Player;
  }

  public static getConfig(playerId: number): HaxRugbyPlayerConfig {
    const config = this.configs.find((config) => config.playerId === playerId);

    if (config) {
      return config;
    }
    const newConfig = new HaxRugbyPlayerConfig(playerId);
    this.configs.push(newConfig);
    return newConfig;
  }

  public static getConfigList(playerIds: number[]): HaxRugbyPlayerConfig[] {
    const configList: HaxRugbyPlayerConfig[] = [];

    playerIds.forEach((playerId) => {
      const config = this.configs.find((config) => config.playerId === playerId);
      if (config) {
        configList.push(config);
        return;
      }
      const newConfig = new HaxRugbyPlayerConfig(playerId);
      this.configs.push(newConfig);
      configList.push(newConfig);
    });

    return configList;
  }
}
