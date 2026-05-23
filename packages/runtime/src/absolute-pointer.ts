import type {
  AbsolutePointer,
  AbsolutePointerMode,
  AbsolutePointerState,
} from '../external/promethee/types';

const POINTER = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.AbsolutePointer,
) as AbsolutePointer | null;

const pointer: AbsolutePointerState = {
  currentX: 0,
  currentY: 0,
  currentZ: 0,
  activeButtons: 0,
};
const mode: AbsolutePointerMode = {
  absoluteMinX: 0,
  absoluteMinY: 0,
  absoluteMinZ: 0,
  absoluteMaxX: 0,
  absoluteMaxY: 0,
  absoluteMaxZ: 0,
  attributes: 0,
};
setInterval(() => {
  const handle = POINTER!.waitForInput();
  const idx = efi.SystemTable.BootServices.WaitForEvent([handle]);
  const state = POINTER!.getState();
  if (state !== null) {
    pointer.activeButtons = state.activeButtons;
    pointer.currentX = state.currentX;
    pointer.currentY = state.currentY;
    pointer.currentZ = state.currentZ;
  }
}, 8);

export default { pointer, mode };
