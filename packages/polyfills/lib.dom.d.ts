declare interface Console {
  log: (text: string) => void;
  error: (text: string | Error) => void;
}

declare interface Performance {
  now: () => number;
}
declare function setTimeout(fn: () => any, ms: number): number;
declare function clearTimeout(id: number): void;
declare function setImmediate(fn: () => any): number;
declare function clearImmediate(id: number): void;
declare function queueMicrotask(fn: () => any): void;
