const Util = {
  timeout: (ms: number, callback: () => void) => {
    const timeout = setTimeout(() => {
      callback();
      clearTimeout(timeout);
    }, ms);
  },

  timeoutAsync: (ms: number, callback: () => void) => {
    return new Promise(() => {
      const timeout = setTimeout(() => {
        callback();
        clearTimeout(timeout);
      }, ms);
    });
  },

  validatePositiveNumericInput: (input?: string): number | false => {
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
};

export default Util;
