import type {
  AbsolutePointer,
  AbsolutePointerMode,
  AbsolutePointerState,
  Pointer,
  PointerMode,
  PointerState,
} from '../external/promethee/types';

const POINTER = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.AbsolutePointer,
) as AbsolutePointer | null;

const pointer: AbsolutePointerState = {
  activeButtons: 0,
  currentX: 0,
  currentY: 0,
  currentZ: 0,
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
  println('before wait');
  const handle = POINTER!.waitForInput();
  const idx = efi.SystemTable.BootServices.WaitForEvent([handle]);
  println('after wait, idx=' + idx);
  const state = POINTER!.getState();
  println('state: ' + JSON.stringify(state));
}, 100);

export default { pointer, mode };
