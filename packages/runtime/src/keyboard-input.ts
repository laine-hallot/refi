import type { EfiKeyData } from '@refi/runtime';

import { EfiShiftStates, ScanCodes, CharCodes } from '@refi/runtime';

export type KeyPressEvent = {
  target: { id: number };
  code: string;
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};

const scanCodeMapping: Record<ScanCodes, string | undefined> = {
  [ScanCodes.ScanNull]: undefined,
  [ScanCodes.ScanUp]: 'ArrowUp',
  [ScanCodes.ScanDown]: 'ArrowDown',
  [ScanCodes.ScanRight]: 'ArrowRight',
  [ScanCodes.ScanLeft]: 'ArrowLeft',
  [ScanCodes.ScanHome]: 'Home',
  [ScanCodes.ScanEnd]: 'End',
  [ScanCodes.ScanInsert]: 'Insert',
  [ScanCodes.ScanDelete]: 'Delete',
  [ScanCodes.ScanPageUp]: 'PageUp',
  [ScanCodes.ScanPageDown]: 'PageDown',
  [ScanCodes.ScanF1]: 'F1',
  [ScanCodes.ScanF2]: 'F2',
  [ScanCodes.ScanF3]: 'F3',
  [ScanCodes.ScanF4]: 'F4',
  [ScanCodes.ScanF5]: 'F5',
  [ScanCodes.ScanF6]: 'F6',
  [ScanCodes.ScanF7]: 'F7',
  [ScanCodes.ScanF8]: 'F8',
  [ScanCodes.ScanF9]: 'F9',
  [ScanCodes.ScanF10]: 'F10',
  [ScanCodes.ScanF11]: 'F11',
  [ScanCodes.ScanF12]: 'F12',
  [ScanCodes.ScanEsc]: 'Escape',
};

const charCodeMapping: Record<CharCodes, string | undefined> = {
  [CharCodes.CharNull]: undefined,
  [CharCodes.CharBackspace]: 'Backspace',
  [CharCodes.CharTab]: 'Tab',
  [CharCodes.CharLinefeed]: 'Enter',
  [CharCodes.CharCarriageReturn]: 'Enter',
};

export const toKey = (unicodeChar: number, scanCode: ScanCodes): string => {
  return (
    scanCodeMapping[scanCode] ??
    charCodeMapping[unicodeChar as CharCodes] ??
    String.fromCharCode(unicodeChar)
  );
};

export const toCode = (unicodeChar: number, scanCode: ScanCodes): string => {
  return (
    scanCodeMapping[scanCode] ??
    charCodeMapping[unicodeChar as CharCodes] ??
    String.fromCharCode(unicodeChar)
  );
};

export const refiKeyDataToKeyEvent = (event: EfiKeyData): KeyPressEvent => {
  return {
    target: event.target,
    code: toCode(event.key.unicodeChar, event.key.scanCode),
    key: toKey(event.key.unicodeChar, event.key.scanCode),
    shiftKey:
      event.keyState.keyShiftState === EfiShiftStates.EfiLeftShiftPressed ||
      event.keyState.keyShiftState === EfiShiftStates.EfiRightShiftPressed,
    ctrlKey:
      event.keyState.keyShiftState === EfiShiftStates.EfiLeftControlPressed ||
      event.keyState.keyShiftState === EfiShiftStates.EfiRightControlPressed,
    altKey:
      event.keyState.keyShiftState === EfiShiftStates.EfiLeftAltPressed ||
      event.keyState.keyShiftState === EfiShiftStates.EfiRightAltPressed,
    metaKey:
      event.keyState.keyShiftState === EfiShiftStates.EfiLeftLogoPressed ||
      event.keyState.keyShiftState === EfiShiftStates.EfiRightLogoPressed,
  };
};
