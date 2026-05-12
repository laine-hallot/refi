export type BltOperation =
  | 'EfiBltVideoFill'
  | 'EfiBltVideoToBltBuffer'
  | 'EfiBltBufferToVideo'
  | 'EfiBltVideoToVideo';

export interface BltPixel {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface GraphicsOutputModeInfo {
  HorizontalResolution: number;
  VerticalResolution: number;
  PixelsPerScanLine: number;
}

export interface GraphicsOutputMode {
  Info?: GraphicsOutputModeInfo;
  Mode?: number;
  MaxMode?: number;
}

export interface GraphicsOutputProtocol {
  Blt(
    pixel: BltPixel,
    operation: BltOperation,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    width: number,
    height: number,
    delta: number,
  ): number;
  Mode?: GraphicsOutputMode;
}

export interface BootServices {
  LocateProtocol(guid: string): GraphicsOutputProtocol | null;
  WaitForEvent(events: EfiEvent[]): number | null;
}

export interface ConsoleOut {
  OutputString(text: string): number;
  ClearScreen(): number;
}

export interface ConsoleIn {
  ReadKeyStroke(): { scanCode: number; unicodeChar: number } | null;
  WaitForKey(): EfiEvent | null;
}

export interface SystemTable {
  BootServices: BootServices;
  ConOut: ConsoleOut;
  ConIn: ConsoleIn;
}

export interface EfiGuid {
  GraphicsOutput: string;
}

export interface Efi {
  SystemTable: SystemTable;
  guid: EfiGuid;
}

export type EfiEvent = unknown;

declare global {
  var efi: Efi;
  function print(msg: string): void;
  function println(msg: string): void;
}
