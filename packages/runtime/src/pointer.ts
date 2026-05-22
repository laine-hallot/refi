import type { Pointer, PointerState } from '../external/promethee/types';

const POINTER = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.Pointer,
) as Pointer | null;

const pointer: PointerState = {
  leftButton: false,
  rightButton: false,
  relativeMovementX: 0,
  relativeMovementY: 0,
  relativeMovementZ: 0,
};
setInterval(() => {
  const pointerEventHandle = POINTER!.waitForInput();
  efi.SystemTable.BootServices.WaitForEvent([pointerEventHandle]);
  const state = POINTER!.getState();
  if (state !== null) {
    pointer.leftButton = state.leftButton;
    pointer.rightButton = state.rightButton;
    pointer.relativeMovementX = state.relativeMovementX;
    pointer.relativeMovementY = state.relativeMovementY;
    pointer.relativeMovementZ = state.relativeMovementZ;
  }
}, 2);

export default pointer;
