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
  }
};

export default Util;
