import type { LayoutElement } from './layout';

import {
  BltPixel,
  GraphicsOutputProtocol,
  HIIFont,
  EfiFontInfoMask,
  EfiHiiFontStyle,
  simplePointer,
} from '@refi/runtime';

const GOP = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.GraphicsOutput,
) as GraphicsOutputProtocol | null;
const HII_FONT = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.HIIFont,
) as HIIFont | null;

type CoordinatePair = {
  x: number;
  y: number;
};
export const drawText = (
  text: Extract<LayoutElement, { component: { type: 'text' } }>,
  position: { x: number; y: number },
) => {
  if (GOP === null || HII_FONT === null) {
    return;
  }

  const horizontalResolution = GOP.Mode?.Info?.HorizontalResolution ?? 0;
  const verticalResolution = GOP.Mode?.Info?.VerticalResolution ?? 0;
  //console.log(`horizontalResolution ${horizontalResolution}`);
  //console.log(`verticalResolution ${verticalResolution}`);

  HII_FONT.StringToImage(
    [
      'EFI_HII_DIRECT_TO_SCREEN',
      'EFI_HII_OUT_FLAG_TRANSPARENT',
      'EFI_HII_OUT_FLAG_CLIP_CLEAN_X',
      'EFI_HII_OUT_FLAG_CLIP_CLEAN_Y',
      'EFI_HII_OUT_FLAG_CLIP',
    ],
    text.component.props.text,
    {
      BackgroundColor: text.component.props.style?.bgColor ?? {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      },
      ForegroundColor: { r: 255, g: 255, b: 255, a: 255 },
      FontInfoMask: [EfiFontInfoMask.EfiFontInfoSysFont],
      FontInfo: {
        fontStyle: EfiHiiFontStyle.EfiHiiFontStyleNormal,
        fontSize: 16,
        FontName: '',
      },
    },
    {
      width: horizontalResolution,
      height: verticalResolution,
    },
    position.x,
    position.y,
    null,
    null,
    null,
  );
};
export const drawRectangle = (
  color: BltPixel,
  position: CoordinatePair,
  dimension: { width: number; height: number },
) => {
  if (GOP === null) {
    return;
  }

  GOP.Blt(
    color,
    'EfiBltVideoFill',
    position.x,
    position.y,
    position.x,
    position.y,
    dimension.width,
    dimension.height,
    0,
  );
};

export const clearScreen = () => {
  if (GOP === null) {
    return;
  }

  const horizontalResolution = GOP.Mode?.Info?.HorizontalResolution ?? 0;
  const verticalResolution = GOP.Mode?.Info?.VerticalResolution ?? 0;

  GOP.Blt(
    { r: 0, g: 0, b: 0, a: 0 },
    'EfiBltVideoFill',
    0,
    0,
    0,
    0,
    horizontalResolution,
    verticalResolution,
    0,
  );
};

simplePointer.registerListener((pointer) => {
  if (GOP === null) {
    return;
  }

  GOP.Blt(
    { r: 255, g: 255, b: 255, a: 255 },
    'EfiBltVideoFill',
    pointer.currentX,
    pointer.currentY,
    pointer.currentX,
    pointer.currentY,
    1,
    1,
    0,
  );
});
