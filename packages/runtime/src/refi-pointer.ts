import type {
  SimplePointer,
  SimplePointerMode,
  SimplePointerState,
} from '../external/promethee/types';
import { getScreenSize } from './graphics';

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

type SimplePointerListener = (pointerInfo: PointerInfo) => void;
const listeners: SimplePointerListener[] = [];
const registerListener = (fb: SimplePointerListener) => {
  listeners.push(fb);
};
refiInput.addPointerListener({ id: 0 }, (event) => {
  if (event.type === 'simple') {
    pointer.leftButton = event.leftButton;
    pointer.rightButton = event.rightButton;
    pointer.currentX = Math.min(
      Math.floor(
        Math.max(pointer.currentX + event.relativeMovementX * 0.0001, 0),
      ),
      getScreenSize().horizontalResolution,
    );
    pointer.currentY = Math.min(
      Math.floor(
        Math.max(pointer.currentY + event.relativeMovementY * 0.0001, 0),
      ),
      getScreenSize().verticalResolution,
    );
    pointer.currentZ = 0;
  } else if (event.type === 'absolute') {
    pointer.leftButton = false;
    pointer.rightButton = false;
    pointer.currentX = Math.min(
      event.currentX,
      getScreenSize().horizontalResolution,
    );
    pointer.currentY = Math.min(
      event.currentY,
      getScreenSize().verticalResolution,
    );
    pointer.currentZ = 0;
  }
});

export default { pointer };
