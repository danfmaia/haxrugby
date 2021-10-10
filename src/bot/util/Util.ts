import * as moment from 'moment';
import { BALL_COLOR_TRANSITION_TICKS } from '../constants/constants';
import colors from '../constants/style/colors';
import PositionEnum from '../enums/PositionEnum';
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

function logMessageWithTime(message: string): void {
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

function transitionBallColor(currentColor: number, count: number): number {
  // console.log('count: ', count);
  return (
    (count * currentColor + (BALL_COLOR_TRANSITION_TICKS - count) * colors.ball) /
    BALL_COLOR_TRANSITION_TICKS
  );
}

const Util = {
  timeout,
  timeoutAsync,
  interval,
  parseNumericInput,
  getDurationString,
  getRemainingTimeString,
  logMessageWithTime,
  getPositionString,
  getPlayerNameAndId,
  transitionBallColor,
};

export default Util;
