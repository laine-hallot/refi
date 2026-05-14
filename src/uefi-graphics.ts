import { BltPixel } from '../types';

const GOP = efi.SystemTable.BootServices.LocateProtocol();

type CoordinatePair = {
  x: number;
  y: number;
};
export const drawRectangle = (
  color: BltPixel,
  position: CoordinatePair,
  dimension: { width: number; height: number },
) => {
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
