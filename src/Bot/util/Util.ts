import * as moment from 'moment';

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

function parseNumericInput(input?: string, positive: boolean = false): number | false {
  if (input) {
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

const Util = {
  timeout,
  timeoutAsync,
  parseNumericInput,
  getDurationString,
  getRemainingTimeString,
};

export default Util;
