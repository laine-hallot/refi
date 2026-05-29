(function () {
  var g =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof global !== 'undefined'
        ? global
        : this;

  var _epoch = typeof Date !== 'undefined' && Date.now ? Date.now() : 0;
  var _mono = 0;

  function nowMs() {
    var d = Date && Date.now ? Date.now() : _epoch;
    var delta = d - _epoch;
    if (delta > _mono) _mono = delta;
    return _mono;
  }

  if (typeof g.performance === 'undefined') {
    g.performance = { now: nowMs };
  } else if (typeof g.performance.now !== 'function') {
    g.performance.now = nowMs;
  }

  if (typeof g.console.error !== 'function') {
    g.console.error = function (e) {
      if (typeof e === 'object') {
        g.console.log(
          `Error(${e.lineNumber ?? '??'}:${e.columnNumber ?? '??'} in ${e.fileName ?? '??'}): ${String(e)}`,
        );
        if (e.stack !== undefined) {
          g.console.log(e.stack);
        }
      } else {
        g.console.log('Error: ' + String(e));
      }
    };
  }

  if (typeof g.setImmediate !== 'function') {
    g.setImmediate = function (fn) {
      return g.setTimeout(fn, 0);
    };
  }
  if (typeof g.clearImmediate !== 'function') {
    g.clearImmediate = g.clearTimeout;
  }
})();
