declare interface Console {
  log: (...text: any[]) => void;
  error: (...text: any[]) => void;
}

declare interface Performance {
  now: () => number;
}

declare function setImmediate(fn: () => any): number;
declare function clearImmediate(id: number): void;

type HostPolyfills = {
  hasWork: () => boolean;
  drainMicrotasks: () => void;
  tick: () => void;
};

declare var __host: HostPolyfills;

declare var console: Console;
