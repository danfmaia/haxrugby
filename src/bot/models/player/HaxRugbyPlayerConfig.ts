export class HaxRugbyPlayerConfig {
  public static configs: HaxRugbyPlayerConfig[] = [];

  public playerId: number;
  public canBeTheOnlyAdmin: boolean = true;

  constructor(playerId: number) {
    this.playerId = playerId;
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
}
