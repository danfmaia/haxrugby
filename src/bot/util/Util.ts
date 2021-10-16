import * as moment from 'moment';

import PositionEnum from '../enums/PositionEnum';
import TeamEnum from '../enums/TeamEnum';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';

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

function transitionBallColor(team: TeamEnum, count: number, totalTicks: number): number | false {
  const percentage = (totalTicks - count) / totalTicks;
  const step = Math.floor(10 * percentage);

  if (team === TeamEnum.RED) {
    switch (step) {
      case 0:
        return 0xf7bdb4;
      case 1:
        return 0xf8c5bd;
      case 2:
        return 0xf9ccc5;
      case 3:
        return 0xfad3cd;
      case 4:
        return 0xfadad6;
      case 5:
        return 0xfbe2de;
      case 6:
        return 0xfce9e6;
      case 7:
        return 0xfdf0ee;
      case 8:
        return 0xfef8f7;
      case 9:
        return 0xffffff;
      default:
    }
  } else if (team === TeamEnum.BLUE) {
    switch (step) {
      case 0:
        return 0xb1cbf2;
      case 1:
        return 0xb9d1f3;
      case 2:
        return 0xc2d6f4;
      case 3:
        return 0xcbdcf6;
      case 4:
        return 0xd4e2f8;
      case 5:
        return 0xdce8f9;
      case 6:
        return 0xe5eefa;
      case 7:
        return 0xeef3fc;
      case 8:
        return 0xf6f9fe;
      case 9:
        return 0xffffff;
      default:
    }
  }

  return false;
}

const Util = {
  timeout,
  timeoutAsync,
  interval,
  parseNumericInput,
  getDurationString,
  getRemainingTimeString,
  logWithTime,
  getPositionString,
  getPlayerNameAndId,
  transitionBallColor,
};

export default Util;
