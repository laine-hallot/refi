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
  LocateProtocol(guid: string): GraphicsOutputProtocol | HIIFont | null;
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
  HIIFont: string;
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
