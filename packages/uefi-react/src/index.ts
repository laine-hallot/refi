import '@refi/polyfills';

export type {
  BoxElement,
  UefiElement,
  UefiNode,
  ElementTypes,
  RootElement,
  TextElement,
  FC,
  FunctionComponent,
} from './types';

export { createRoot } from './reconciler';

export { getScreenSize } from './uefi-graphics';

export { useGlobalKeyboard } from './hooks';
