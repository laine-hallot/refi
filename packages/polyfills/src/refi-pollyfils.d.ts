declare module 'DOM' {
  interface console {
    log: (text: string) => void;
    error: (text: string | Error) => void;
  }

  interface performance {
    now: () => number;
  }
  type setTimeout = (fn: () => any, ms: number) => number;
  type clearTimeout = (id: number) => void;
  type setImmediate = (fn: () => any) => number;
  type clearImmediate = (id: number) => void;
}
