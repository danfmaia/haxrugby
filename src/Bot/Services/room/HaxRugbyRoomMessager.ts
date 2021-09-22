import styles from '../../constants/styles';
import { IHaxRugbyRoom } from '../../rooms/IHaxRugbyRoom';
import Util from '../../util/Util';

export interface IHaxRugbyRoomMessager {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBoldAnnouncement(message: string, sound: number, playerId?: number): void;
  sendMatchStatus(sound?: number, playerId?: number): void;
  sendPromotionLinks(playerId?: number): void;
}

export default class HaxRugbyRoomMessager implements IHaxRugbyRoomMessager {
  private _room: IHaxRugbyRoom;

  constructor(room: IHaxRugbyRoom) {
    this._room = room;
  }

  public sendNormalAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this._room.sendAnnouncement(message, playerId, styles.haxruGreen, undefined, sound);
  }

  public sendBoldAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this._room.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  public sendMatchStatus(sound: number = 0, playerId?: number) {
    let timeString: string;
    if (this._room.isOvertime === false) {
      timeString = Util.getRemainingTimeString(this._room.remainingTime);
    } else {
      timeString = `${Util.getRemainingTimeString(this._room.remainingTime)} do overtime`;
    }

    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this._room.scoreA}-${this._room.scoreB} | ${timeString}`,
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
