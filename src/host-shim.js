(function () {
  var g = (typeof globalThis !== 'undefined') ? globalThis
    : (typeof global !== 'undefined') ? global
      : this;

  var _epoch = (typeof Date !== 'undefined' && Date.now) ? Date.now() : 0;
  var _mono = 0;

  function nowMs() {
    var d = (Date && Date.now) ? Date.now() : _epoch;
    var delta = d - _epoch;
    if (delta > _mono) _mono = delta;
    return _mono;
  }

  if (typeof g.performance === 'undefined') {
    g.performance = { now: nowMs };
  } else if (typeof g.performance.now !== 'function') {
    g.performance.now = nowMs;
  }

  var _timers = [];
  var _nextId = 1;

  if (typeof g.console.error !== 'function') {
    g.console.error = function (e) { g.console.log('Error: ' + String(e)) };
  }

  if (typeof g.setTimeout !== 'function') {
    g.setTimeout = function (fn, ms) {
      //console.log('setTimeout: - timeout ' + ms)
      //console.log("setTimeOut - nowMs(): " + nowMs())
      //console.log("setTimeOut - Date.now(): " + Date.now())
      var id = _nextId++;
      _timers.push({ id: id, fn: fn, due: nowMs() + (ms | 0) });
      return id;
    };
  }
  if (typeof g.clearTimeout !== 'function') {
    g.clearTimeout = function (id) {
      for (var i = 0; i < _timers.length; i++) {
        if (_timers[i].id === id) { _timers.splice(i, 1); return; }
      }
    };
  }

  if (typeof g.setTimeout !== 'function') {
    g.setInterval = function (fn, ms) {
      var id = _nextId++;
      _timers.push({ id: id, fn: fn, due: nowMs() + (ms | 0) });
      return id;
    };
  }

  if (typeof g.setImmediate !== 'function') {
    g.setImmediate = function (fn) { return g.setTimeout(fn, 0); };
  }
  if (typeof g.clearImmediate !== 'function') {
    g.clearImmediate = g.clearTimeout;
  }

  var _microtasks = [];
  if (typeof g.queueMicrotask !== 'function') {
    g.queueMicrotask = function (fn) { _microtasks.push(fn); };
  }

  g.__host = {
    drainMicrotasks: function () {
      var guard = 10000; // catastrophic loop guard
      while (_microtasks.length && guard-- > 0) {
        var fn = _microtasks.shift();
        try {
          //console.log('calling microtask function');
          fn();
        } catch (e) {
          console.error(e);
        }
      }
    },

    tick: function () {
      //console.log('tick');
      var now = nowMs();
      // Pull due timers out first, in scheduling order.
      var ready = [];
      for (var i = 0; i < _timers.length; i++) {
        if (_timers[i].due <= now) ready.push(_timers[i]);
      }
      for (var j = 0; j < ready.length; j++) {
        var idx = _timers.indexOf(ready[j]);
        if (idx >= 0) _timers.splice(idx, 1);
        try {
          //console.log('calling timer function "' + ready[j].fn.name + '":');
          //console.log('Callback exists: ' + String(ready[j].fn !== undefined))
          ready[j].fn();
        } catch (e) {
          console.log('error in timer callback "' + ready[j].fn.name + '":');
          console.log(e);
        }
      }
      this.drainMicrotasks();
    },

    hasWork: function () {
      return _timers.length > 0 || _microtasks.length > 0;
    },
  };
})();
