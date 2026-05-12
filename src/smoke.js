// smoke.js — ES2015+ feature probe for embedded JS engines.
//
// Designed to parse on any ES5 engine. Runtime features are probed via
// typeof + try/catch; syntax features are probed via `new Function(src)`
// so parse errors are caught instead of killing the whole file.
//
// Run:
//   duk smoke.js        # Duktape
//   qjs smoke.js        # QuickJS
//   node smoke.js       # Node (for sanity check)
//   (or load as script.js under Promethee — output goes to UEFI console)
//
// Three outcome categories:
//   pass  — feature exists and works
//   FAIL  — feature exists but produced wrong result (broken impl)
//   MISS  — feature absent (ReferenceError / SyntaxError / TypeError on missing)

var results = [];
var pass = 0, fail = 0, missing = 0;

// ---- output shim ----------------------------------------------------------
// Tries multiple host environments. UEFI's ConOut wants UTF-16; if the
// Promethee binding doesn't auto-convert ASCII, you'll get garbage there
// and should fall back to reading via QEMU's serial or stdout.
function log(s) {
  if (typeof print === 'function') { print(s + '\r\n'); return; }
  if (typeof console !== 'undefined' && console.log) { console.log(s + '\r\n'); return; }
  if (typeof efi !== 'undefined' && efi.SystemTable && efi.SystemTable.ConOut) {
    try { efi.SystemTable.ConOut.OutputString(s + '\r\n'); return; } catch (e) { }
  }
  // Last resort — throw so the host at least surfaces *something*.
  throw new Error('no output method: ' + s);
}

function record(status, name, detail) {
  var line = status + '  ' + name;
  if (detail) line += '  (' + detail + ')';
  results.push(line);
  if (status === 'pass') pass++;
  else if (status === 'MISS') missing++;
  else fail++;
}

function test(name, fn) {
  try {
    var ok = fn();
    if (ok === false) record('FAIL', name, 'returned false');
    else record('pass', name);
  } catch (e) {
    var msg = (e && (e.message || e.name)) || String(e);
    var n = e && e.name;
    if (n === 'ReferenceError' || n === 'TypeError') record('MISS', name, msg);
    else record('FAIL', name, msg);
  }
}

function testSyntax(name, src) {
  try {
    var fn = new Function(src);
    fn();
    record('pass', 'syntax: ' + name);
  } catch (e) {
    var msg = (e && (e.message || e.name)) || String(e);
    if (e && e.name === 'SyntaxError') record('MISS', 'syntax: ' + name, msg);
    else record('FAIL', 'syntax: ' + name, msg);
  }
}

// ---- runtime: collections -------------------------------------------------

test('Symbol exists', function () { return typeof Symbol === 'function'; });
test('Symbol() unique', function () {
  var a = Symbol('a'), b = Symbol('a');
  return a !== b && typeof a === 'symbol';
});
test('Symbol.iterator well-known', function () {
  return typeof Symbol.iterator === 'symbol';
});
test('Symbol.for / Symbol.keyFor', function () {
  var s = Symbol.for('smoke');
  return Symbol.for('smoke') === s && Symbol.keyFor(s) === 'smoke';
});

test('Map exists', function () { return typeof Map === 'function'; });
test('Map set/get/has/size', function () {
  var m = new Map();
  m.set('a', 1).set('b', 2);
  return m.get('a') === 1 && m.has('b') && m.size === 2;
});
test('Map with object key', function () {
  var m = new Map(), k = {};
  m.set(k, 'v');
  return m.get(k) === 'v';
});
test('Map iteration via forEach', function () {
  var m = new Map([['a', 1], ['b', 2]]);
  var n = 0;
  m.forEach(function () { n++; });
  return n === 2;
});

test('Set exists', function () { return typeof Set === 'function'; });
test('Set dedup + size', function () {
  var s = new Set();
  s.add(1); s.add(1); s.add(2);
  return s.size === 2 && s.has(1);
});

test('WeakMap exists', function () { return typeof WeakMap === 'function'; });
test('WeakMap set/get/has/delete', function () {
  var wm = new WeakMap(), k = {};
  wm.set(k, 'x');
  if (wm.get(k) !== 'x' || !wm.has(k)) return false;
  wm['delete'](k);
  return !wm.has(k);
});

test('WeakSet exists', function () { return typeof WeakSet === 'function'; });
test('WeakSet add/has', function () {
  var ws = new WeakSet(), k = {};
  ws.add(k);
  return ws.has(k);
});

// ---- runtime: Promise -----------------------------------------------------
// React/scheduler care a lot about Promise. Existence is necessary but not
// sufficient — the host also needs a microtask drain. We can only check
// existence and sync behaviour here.

test('Promise exists', function () { return typeof Promise === 'function'; });
test('Promise.resolve returns thenable', function () {
  var p = Promise.resolve(42);
  return p && typeof p.then === 'function';
});
test('Promise.all exists', function () { return typeof Promise.all === 'function'; });
test('Promise.race exists', function () { return typeof Promise.race === 'function'; });
test('Promise.reject + catch chain', function () {
  var caught = false;
  Promise.reject(new Error('x'))['catch'](function () { caught = true; });
  // Can't reliably assert caught===true without a microtask tick; just
  // verify the chain didn't blow up synchronously.
  return true;
});

// ---- runtime: scheduling primitives --------------------------------------
test('queueMicrotask exists', function () { return typeof queueMicrotask === 'function'; });
test('setTimeout / clearTimeout exist', function () {
  return typeof setTimeout === 'function' && typeof clearTimeout === 'function';
});
test('Date.now', function () { return typeof Date.now() === 'number'; });
test('performance.now', function () {
  return typeof performance !== 'undefined' && typeof performance.now === 'function';
});

// ---- runtime: Object / Array / Reflect / Proxy ---------------------------

test('Object.assign', function () {
  var r = Object.assign({}, { a: 1 }, { b: 2 });
  return r.a === 1 && r.b === 2;
});
test('Object.keys/values/entries', function () {
  var o = { a: 1, b: 2 };
  return Object.keys(o).length === 2
    && typeof Object.values === 'function' && Object.values(o).length === 2
    && typeof Object.entries === 'function' && Object.entries(o).length === 2;
});
test('Object.getOwnPropertySymbols', function () {
  return typeof Object.getOwnPropertySymbols === 'function';
});

test('Array.from (array-like)', function () {
  return Array.from({ length: 3, 0: 'a', 1: 'b', 2: 'c' }).length === 3;
});
test('Array.from (iterable)', function () {
  return Array.from(new Set([1, 2, 3])).length === 3;
});
test('Array.from (mapper)', function () {
  return Array.from([1, 2, 3], function (x) { return x * 2; }).join(',') === '2,4,6';
});
test('Array.of', function () { return Array.of(1, 2, 3).length === 3; });
test('Array.prototype.includes', function () { return [1, 2, 3].includes(2); });
test('Array.prototype.find/findIndex', function () {
  return [1, 2, 3].find(function (x) { return x > 1; }) === 2
    && [1, 2, 3].findIndex(function (x) { return x > 1; }) === 1;
});
test('Array.prototype.flat/flatMap', function () {
  return typeof [].flat === 'function' && typeof [].flatMap === 'function';
});

test('Reflect exists', function () { return typeof Reflect === 'object' && Reflect !== null; });
test('Reflect.has / Reflect.get', function () {
  var o = { a: 1 };
  return Reflect.has(o, 'a') && Reflect.get(o, 'a') === 1;
});
test('Reflect.ownKeys', function () {
  return Reflect.ownKeys({ a: 1, b: 2 }).length === 2;
});

test('Proxy exists', function () { return typeof Proxy === 'function'; });
test('Proxy get trap', function () {
  var p = new Proxy({}, { get: function (t, k) { return k + '!'; } });
  return p.foo === 'foo!';
});

// ---- runtime: typed arrays -----------------------------------------------

test('Uint8Array basic', function () {
  var a = new Uint8Array(4);
  a[0] = 255; a[1] = 256; // 256 should wrap to 0
  return a[0] === 255 && a[1] === 0 && a.length === 4;
});
test('ArrayBuffer + DataView', function () {
  var b = new ArrayBuffer(4);
  var v = new DataView(b);
  v.setUint32(0, 0x12345678);
  return v.getUint32(0) === 0x12345678;
});

// ---- runtime: misc -------------------------------------------------------

test('String startsWith/endsWith/includes/repeat', function () {
  return 'abc'.startsWith('a')
    && 'abc'.endsWith('c')
    && 'abc'.includes('b')
    && 'ab'.repeat(3) === 'ababab';
});
test('Math.trunc/sign/log2/cbrt/hypot', function () {
  return typeof Math.trunc === 'function'
    && typeof Math.sign === 'function'
    && typeof Math.log2 === 'function'
    && typeof Math.cbrt === 'function'
    && typeof Math.hypot === 'function';
});
test('Number.isInteger / isFinite / isNaN', function () {
  return typeof Number.isInteger === 'function'
    && typeof Number.isFinite === 'function'
    && typeof Number.isNaN === 'function';
});
test('JSON.stringify/parse round-trip', function () {
  return JSON.parse(JSON.stringify({ a: 1 })).a === 1;
});

// ---- syntax probes (parse-time features) ---------------------------------
// Each is wrapped in `new Function` so a SyntaxError doesn't take out the
// whole file. Throw on logical failure so we can distinguish from missing.

testSyntax('arrow fn',
  'if ((() => 42)() !== 42) throw new Error("bad");');
testSyntax('let / const',
  'let a = 1; const b = 2; if (a + b !== 3) throw new Error("bad");');
testSyntax('template literal',
  'var x = 1; if (`v=${x}` !== "v=1") throw new Error("bad");');
testSyntax('destructuring (object)',
  'var { a, b } = { a: 1, b: 2 }; if (a + b !== 3) throw new Error("bad");');
testSyntax('destructuring (array)',
  'var [a, b] = [1, 2]; if (a + b !== 3) throw new Error("bad");');
testSyntax('default params',
  'function f(x = 5) { return x; } if (f() !== 5) throw new Error("bad");');
testSyntax('rest params',
  'function f(...a) { return a.length; } if (f(1,2,3) !== 3) throw new Error("bad");');
testSyntax('spread (call)',
  'function f(a,b,c) { return a+b+c; } if (f(...[1,2,3]) !== 6) throw new Error("bad");');
testSyntax('spread (array literal)',
  'if ([...[1,2,3]].length !== 3) throw new Error("bad");');
testSyntax('spread (object literal)',
  'var o = { ...{a:1}, ...{b:2} }; if (o.a + o.b !== 3) throw new Error("bad");');
testSyntax('computed prop names',
  'var k = "x"; var o = { [k]: 1 }; if (o.x !== 1) throw new Error("bad");');
testSyntax('shorthand methods',
  'var o = { f() { return 1; } }; if (o.f() !== 1) throw new Error("bad");');
testSyntax('class',
  'class C { constructor() { this.x = 1; } } if (new C().x !== 1) throw new Error("bad");');
testSyntax('class extends + super',
  'class A { constructor() { this.a = 1; } }'
  + ' class B extends A { constructor() { super(); this.b = 2; } }'
  + ' var b = new B(); if (b.a + b.b !== 3) throw new Error("bad");');
testSyntax('generators (function*)',
  'function* g() { yield 1; yield 2; }'
  + ' var it = g(); if (it.next().value + it.next().value !== 3) throw new Error("bad");');
testSyntax('for...of',
  'var s = 0; for (var x of [1,2,3]) s += x; if (s !== 6) throw new Error("bad");');
testSyntax('async fn',
  'async function f() { return 1; } if (typeof f().then !== "function") throw new Error("bad");');
testSyntax('optional chaining',
  'var o = null; if (o?.x !== undefined) throw new Error("bad");');
testSyntax('nullish coalescing',
  'if ((null ?? 5) !== 5) throw new Error("bad");');
testSyntax('exponent operator',
  'if ((2 ** 3) !== 8) throw new Error("bad");');
testSyntax('logical assignment (??=, ||=, &&=)',
  'var a = null; a ??= 1; if (a !== 1) throw new Error("bad");');

// ---- summary -------------------------------------------------------------

log('');
log('===== ES2015+ smoke test =====');
for (var i = 0; i < results.length; i++) log(results[i]);
log('');
log('pass: ' + pass + '  FAIL: ' + fail + '  MISS: ' + missing);
log('total: ' + (pass + fail + missing));
log('==============================');
