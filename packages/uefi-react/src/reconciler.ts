import type {
  RootContainer,
} from './types';

import { reconciler } from './host-config';
import { getScreenSize } from './uefi-graphics.js';

const screen = getScreenSize();

export const createRoot = (options: { fullscreen?: boolean, bgColor?: BltPixel }) => {
  const container: RootContainer = {
    type: 'root',
    props: {
      height: screen.verticalResolution,
      width: screen.horizontalResolution,
      bgColor: { r: 5, g: 6, b: 22, a: 255 },
    },
    children: [],
  };

  const root = reconciler.createContainer(
    container,
    0,
    null,
    false,
    null,
    '',
    (e) => {
      console.log("UNCAUGHT ERROR");
      console.error(e);
    },
    (e) => {
      console.error(e);
    },
    (error) => {
      console.error(error);
      console.error(error.message);
    },
    () => { },
  );

  const updateRoot = (element: React.ReactNode) => {
    reconciler.updateContainer(element, root, null, null);
  };
  return { updateRoot }
}
