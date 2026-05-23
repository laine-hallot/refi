import type {
  SimplePointer,
  SimplePointerMode,
  SimplePointerState,
} from '../external/promethee/types';
import { getScreenSize } from './graphics';

const POINTER = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.Pointer,
) as SimplePointer | null;

export type PointerInfo = {
  currentX: number;
  currentY: number;
  currentZ: number;
  leftButton: boolean;
  rightButton: boolean;
};
const pointer: PointerInfo = {
  currentX: 0,
  currentY: 0,
  currentZ: 0,
  leftButton: false,
  rightButton: false,
};

const mode: SimplePointerMode = {
  resolutionX: 0,
  resolutionY: 0,
  resolutionZ: 0,
  leftButton: false,
  rightButton: false,
};
type SimplePointerListener = (pointerInfo: PointerInfo) => void;
const listeners: SimplePointerListener[] = [];
const registerListener = (fb: SimplePointerListener) => {
  listeners.push(fb);
};

setInterval(() => {
  const handle = POINTER!.waitForInput();
  const idx = efi.SystemTable.BootServices.WaitForEvent([handle]);
  const state = POINTER!.getState();
  if (state !== null) {
    pointer.leftButton = state.leftButton;
    pointer.rightButton = state.rightButton;
    pointer.currentX = Math.min(
      Math.max(pointer.currentX + state.relativeMovementX * 0.0001, 0),
      getScreenSize().horizontalResolution,
    );
    pointer.currentY = Math.min(
      Math.max(pointer.currentY + state.relativeMovementY * 0.0001, 0),
      getScreenSize().verticalResolution,
    );
    pointer.currentZ = 0;
  }
  for (const listener of listeners) {
    listener(pointer);
  }
}, 8);

export default { pointer, mode, registerListener };
