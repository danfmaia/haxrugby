import * as moment from 'moment';

import PositionEnum from '../enums/PositionEnum';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';

function newGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function timeout(ms: number, callback: () => void): void {
  const timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, ms);
}

function timeoutAsync(ms: number, callback: () => void): Promise<unknown> {
  return new Promise(() => {
    const timeout = setTimeout(() => {
      callback();
      clearTimeout(timeout);
    }, ms);
  });
}

function interval(ms: number, callback: () => void): number {
  return setInterval(() => {
    callback();
  }, ms);
}

function parseNumericInput(input?: string, positive: boolean = false): number | false {
  if (input) {
    input = input.replace('#', '');
    if (input === '') {
      return false;
    }
    const parsed = parseInt(input);
    if (positive && parsed < 1) {
      return false;
    } else {
      const floored = Math.floor(parsed);
      if (positive && floored < 1) {
        return false;
      } else {
        return floored;
      }
    }
  }
  return false;
}

function getDurationString(timeLimit: number): string {
  if (timeLimit > 1) {
    return `Duração:  ${timeLimit} minutos`;
  } else {
    return 'Duração:  1 minuto';
  }
}

function getRemainingTimeString(remainingTimeInMs: number): string {
  const remaniningTime = moment.duration(Math.abs(remainingTimeInMs));
  return moment.utc(remaniningTime.as('milliseconds')).format('mm:ss');
}

function logWithTime(message: string): void {
  const time = moment().format('HH:mm:ss');
  console.log(`${time} > ${message}`);
}

function getPositionString(position: PositionEnum): string {
  switch (position) {
    case PositionEnum.KICKER:
      return 'Kicker';
    case PositionEnum.GOALKEEPER:
      return 'GK';
    default:
      return '';
  }
}

function getPlayerNameAndId(player: HaxRugbyPlayer): string {
  return `${player.name} (ID: ${player.id})`;
}

// borrowed from Gab
const asianRegex = RegExp(
  /[\p{Script_Extensions=Mymr}\p{Script_Extensions=Han}\p{Script_Extensions=Hira}\p{Script_Extensions=Kana}\p{Script_Extensions=Bopo}\p{Script=Khmer}\p{Script=Lao}\p{Script_Extensions=Phag}\p{Script=Tai_Tham}\p{Script=Thai}\p{Script=Tibetan}]/gu,
);
const emojiRegex = RegExp(
  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu,
);
const longRegex = RegExp(/(⸻|𒈙|𒐫|﷽|𒍙|𒊎|𒄡|𒅌|𒁏|𒀰|𒐪|𒐩|𒈙|𒐫)/gi);

// borrowed from Gab
function isUsingIllegalChars(message: string): boolean {
  const asian = (message.match(asianRegex) || []).length;
  const emoji = (message.match(emojiRegex) || []).length;
  const long = (message.match(longRegex) || []).length;

  if (long > 0) return true;
  if (asian > 10) return true;
  if (asian + emoji > 15) return true;

  return false;
}

const Util = {
  newGuid,
  timeout,
  timeoutAsync,
  interval,
  parseNumericInput,
  getDurationString,
  getRemainingTimeString,
  logWithTime,
  getPositionString,
  getPlayerNameAndId,
  isUsingIllegalChars,
};

export default Util;
