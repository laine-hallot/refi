import { GraphicsOutputProtocol } from '../external/promethee/types';

const GOP = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.GraphicsOutput,
) as GraphicsOutputProtocol | null;

export const getScreenSize = () => {
  if (GOP === null) {
    return { horizontalResolution: 0, verticalResolution: 0 };
  }

  const horizontalResolution = GOP.Mode!.Info!.HorizontalResolution;
  const verticalResolution = GOP.Mode!.Info!.VerticalResolution;

  return { horizontalResolution, verticalResolution };
};
