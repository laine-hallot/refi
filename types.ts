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

type EfiHiiOutFlags =
  | 'EFI_HII_OUT_FLAG_CLIP'
  | 'EFI_HII_OUT_FLAG_WRAP'
  | 'EFI_HII_OUT_FLAG_CLIP_CLEAN_Y'
  | 'EFI_HII_OUT_FLAG_CLIP_CLEAN_X'
  | 'EFI_HII_OUT_FLAG_TRANSPARENT'
  | 'EFI_HII_IGNORE_IF_NO_GLYPH'
  | 'EFI_HII_IGNORE_LINE_BREAK'
  | 'EFI_HII_DIRECT_TO_SCREEN';

interface EfiFontInfo {
  fontStyle: EfiHiiFontStyle;
  fontSize: number;
  FontName: string;
}

interface EfiFontDisplayInfo {
  ForegroundColor: BltPixel;
  BackgroundColor: BltPixel;
  FontInfoMask: EfiFontInfoMask[];
  FontInfo: EfiFontInfo;
}
export enum EfiHiiFontStyle {
  EfiHiiFontStyleNormal = 0x00000000,
  EfiHiiFontStyleBold = 0x00000001,
  EfiHiiFontStyleItalic = 0x00000002,
  EfiHiiFontStyleEmboss = 0x00010000,
  EfiHiiFontStyleOutline = 0x00020000,
  EfiHiiFontStyleShadow = 0x00040000,
  EfiHiiFontStyleUnderline = 0x00080000,
  EfiHiiFontStyleDblUnder = 0x00100000,
}

export enum EfiFontInfoMask {
  /**
   * @description The font name in FontInfo is ignored and the system font name is used.
   *
   * Cannot be used with EfiFontInfoAnyFont.
   */
  EfiFontInfoSysFont = 0x00000001,
  /**
   * @description The font height specified in FontInfo is ignored and the system font height is used instead.
   *
   * Cannot be used with EfiFontInfoAnySize.
   */
  EfiFontInfoSysSize = 0x00000002,
  /**
   * @description The font style in FontInfo is ignored and the system font style is used.
   *
   * Cannot be used with EfiFontInfoAnyStyle.
   */
  EfiFontInfoSysStyle = 0x00000004,
  /**
   * @description ForegroundColor is ignored and the system foreground color is used.
   */
  EfiFontInfoSysForeColor = 0x00000010,
  /**
   * @description BackgroundColor is ignored and the system background color is used.
   */
  EfiFontInfoSysBackColor = 0x00000020,
  /**
   * @description The system may attempt to stretch or shrink a font to meet the size requested.
   *
   * Cannot be used with EfiFontInfoAnySize.
   */
  EfiFontInfoResize = 0x00001000,
  /**
   * @description The system may attempt to remove some of the specified styles in order to meet the style requested.
   *
   * Cannot be used with EfiFontInfoAnyStyle.
   */
  EfiFontInfoRestyle = 0x00002000,
  /**
   * @description The system may attempt to match with any font.
   *
   * Cannot be used with EfiFontInfoSysFont.
   */
  EfiFontInfoAnyFont = 0x00010000,
  /**
   * @description The system may attempt to match with any font size.
   *
   * Cannot be used with EfiFontInfoSysSize or EfiFontInfoResize.
   */
  EfiFontInfoAnySize = 0x00020000,
  /**
   * @description The system may attempt to match with any font style.
   *
   * Cannot be used with EfiFontInfoSysStyle or EFI_FONT_INFO_RESTYLE.
   */
  EfiFontInfoAnyStyle = 0x00040000,
}

interface EfiImageOutput {
  width: number;
  height: number;
  /*  image:
      | {
          Bitmap: BltPixel;
        }
      | {
          Screen: GraphicsOutputProtocol;
          }; */
}

export interface HIIFont {
  StringToImage(
    flags: EfiHiiOutFlags[],
    text: string,
    stringInfo: EfiFontDisplayInfo | null,
    blt: EfiImageOutput,
    bltX: number,
    bltY: number,
    rowInfoArray: unknown | null,
    rowInfoArraySize: number | null,
    columnInfoArray: number | null,
  ): number;
}

export interface BootServices {
  LocateProtocol(guid: string): GraphicsOutputProtocol | HIIFont | ConEx | null;
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

export enum ScanCodes {
  ScanNull = 0x0000,
  ScanUp = 0x0001,
  ScanDown = 0x0002,
  ScanRight = 0x0003,
  ScanLeft = 0x0004,
  ScanHome = 0x0005,
  ScanEnd = 0x0006,
  ScanInsert = 0x0007,
  ScanDelete = 0x0008,
  ScanPageUp = 0x0009,
  ScanPageDown = 0x000a,
  ScanF1 = 0x000b,
  ScanF2 = 0x000c,
  ScanF3 = 0x000d,
  ScanF4 = 0x000e,
  ScanF5 = 0x000f,
  ScanF6 = 0x0010,
  ScanF7 = 0x0011,
  ScanF8 = 0x0012,
  ScanF9 = 0x0013,
  ScanF10 = 0x0014,
  ScanF11 = 0x0015,
  ScanF12 = 0x0016,
  ScanEsc = 0x0017,
}

export interface EfiInputKey {
  scanCode: ScanCodes;
  unicodeChar: number;
}

export enum CharCodes {
  CharNull = 0x0000,
  CharBackspace = 0x0008,
  CharTab = 0x0009,
  CharLinefeed = 0x000A,
  CharCarriageReturn = 0x000D,
}

export enum EfiShiftStates {
  EfiShiftStateValid = 0x80000000,
  EfiRightShiftPressed = 0x00000001,
  EfiLeftShiftPressed = 0x00000002,
  EfiRightControlPressed = 0x00000004,
  EfiLeftControlPressed = 0x00000008,
  EfiRightAltPressed = 0x00000010,
  EfiLeftAltPressed = 0x00000020,
  EfiRightLogoPressed = 0x00000040,
  EfiLeftLogoPressed = 0x00000080,
  EfiMenuKeyPressed = 0x00000100,
  EfiSysReqPressed = 0x00000200,
}

export enum EfiToggleStates {
  EfiToggleStateValid = 0x80,
  EfiKeyStateExposed = 0x40,
  EfiScrollLockActive = 0x01,
  EfiNumLockActive = 0x02,
  EfiCapsLockActive = 0x04,
}

export interface EfiKeyState {
  keyShiftState: EfiShiftStates | 0;
  keyToggleState: EfiToggleStates | 0;
}

export interface EfiKeyData {
  keyState: EfiKeyState;
  key: EfiInputKey;
}

export interface ConEx {
  RegisterKeyNotify: (
    options: EfiKeyData,
    cb: (keyData: EfiKeyData) => void,
  ) => number;
  UnregisterKeyNotify: (handle: number) => void;
}

export interface SystemTable {
  BootServices: BootServices;
  ConOut: ConsoleOut;
  ConIn: ConsoleIn;
}

export interface EfiGuid {
  GraphicsOutput: string;
  HIIFont: string;
  ConEx: string;
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
