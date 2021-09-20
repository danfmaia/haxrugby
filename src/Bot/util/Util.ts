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

const Util = {
  timeout,
  timeoutAsync,
  validatePositiveNumericInput
};

export default Util;
