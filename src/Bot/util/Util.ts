import * as moment from 'moment';

function timeout(ms: number, callback: () => void) {
  const timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, ms);
}

function timeoutAsync(ms: number, callback: () => void) {
  return new Promise(() => {
    const timeout = setTimeout(() => {
      callback();
      clearTimeout(timeout);
    }, ms);
  });
}

function validatePositiveNumericInput(input?: string): number | false {
  if (input) {
    const parsed = parseInt(input);
    if (parsed) {
      const floored = Math.floor(parsed);
      if (floored > 0) {
        return floored;
      }
    }
  }
  return false;
}

function getDurationString(timeLimit: number) {
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
  validatePositiveNumericInput,
  getDurationString,
  getRemainingTimeString,
};

export default Util;
