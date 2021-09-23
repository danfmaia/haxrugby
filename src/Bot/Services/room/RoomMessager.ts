import { MSG_GREETING_1, MSG_GREETING_2 } from '../../constants/dictionary';
import styles from '../../constants/styles';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';

export interface IRoomMessager {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBoldAnnouncement(message: string, sound: number, playerId?: number): void;

  sendGreetingsToIncomingPlayer(playerId: number): void;
  sendMatchStatus(sound?: number, playerId?: number): void;
  sendPromotionLinks(playerId?: number): void;
}

export default class RoomMessager implements IRoomMessager {
  private room: IHaxRugbyRoom;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
  }

  public sendNormalAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, undefined, sound);
  }

  public sendBoldAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  public sendGreetingsToIncomingPlayer(playerId: number) {
    this.sendBoldAnnouncement(MSG_GREETING_1, 2, playerId);
    this.sendNormalAnnouncement(MSG_GREETING_2, 0, playerId);
    if (this.room.isMatchInProgress) {
      this.sendMatchStatus(0, playerId);
    }
    Util.timeout(10000, () => {
      this.sendPromotionLinks(playerId);
    });
  }

  public sendMatchStatus(sound: number = 0, playerId?: number) {
    let timeString: string;
    if (this.room.isOvertime === false) {
      timeString = Util.getRemainingTimeString(this.room.remainingTime);
    } else {
      timeString = `${Util.getRemainingTimeString(this.room.remainingTime)} do overtime`;
    }

    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this.room.score.a}-${this.room.score.b} | ${timeString}`,
      sound,
      playerId,
    );
  }

  public sendPromotionLinks(playerId?: number) {
    this.sendBoldAnnouncement('Regras do jogo:', 2, playerId);
    this.sendNormalAnnouncement('    sites.google.com/site/haxrugby/regras-completas', 0, playerId);

    this.sendBoldAnnouncement('Server no DISCORD:', 0, playerId);
    this.sendNormalAnnouncement('    discord.io/HaxRugby', 0, playerId);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', 0, playerId);
    this.sendNormalAnnouncement('    fb.com/groups/haxrugby', 0, playerId);
  }
}
