import type { BltPixel } from '@refi/runtime';
import type { RootElement } from '@refi/layout-engine';
import { getScreenSize } from '@refi/runtime';

import { reconciler } from './host-config';

const screen = getScreenSize();

export const createRoot = (options: {
  fullscreen?: boolean;
  bgColor?: BltPixel;
}) => {
  const container: RootElement = {
    __id: 0,
    type: 'root',
    props: {
      style: {
        height: screen.verticalResolution,
        width: screen.horizontalResolution,
        bgColor: { r: 96, g: 100, b: 135, a: 255 },
      },
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
    (error) => {
      console.error(error);
    },
    (error) => {
      console.error(error);
    },
    (error) => {
      console.error(error);
    },
    () => {},
  );

  const updateRoot = (element: React.ReactNode) => {
    reconciler.updateContainer(element, root, null, null);
  };
  return { updateRoot };
};
