declare interface Console {
  log: (...text: any[]) => void;
  error: (...text: any[]) => void;
}

declare interface Performance {
  now: () => number;
}

declare function setTimeout(fn: () => any, ms: number): number;
declare function clearTimeout(id: number): void;
declare function setInterval(fn: () => any, ms: number): number;
declare function clearInterval(id: number): void;
declare function setImmediate(fn: () => any): number;
declare function clearImmediate(id: number): void;
declare function queueMicrotask(fn: () => any): void;

type HostPolyfills = {
  hasWork: () => boolean;
  drainMicrotasks: () => void;
  tick: () => void;
};

declare var __host: HostPolyfills;

declare var console: Console;
