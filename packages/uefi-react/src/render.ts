import type { BltPixel, HIIFont } from '../types';
import type { RootContainer } from './types';

import { match } from 'match-discriminated-union';

import {
  calculateRoot,
  LayoutElement,
} from '@refi/layout-engine';

import {
  clearScreen,
  drawRectangle,
  drawText,
  getScreenSize,
} from './uefi-graphics';

const colorOrder: BltPixel[] = [
  { r: 255, g: 0, b: 0, a: 255 },
  { r: 0, g: 255, b: 0, a: 255 },
  { r: 0, g: 0, b: 255, a: 255 },
];
const colorOrderText: BltPixel[] = [
  { r: 255, g: 0, b: 255, a: 255 },
  { r: 255, g: 255, b: 0, a: 255 },
];
let colorIndex = 0;
const getColor = () => {
  const color = colorOrder[colorOrder.length - (1 % colorIndex)];
  colorIndex = colorIndex + 1;
  return color;
};

const DEBUG = true;

const renderBox = (layout: LayoutElement): void => {
  if (DEBUG) {
    println(layout.type + ': ' + JSON.stringify(layout.container));
  } else {
    drawRectangle(
      colorOrder[0],
      { x: layout.container.x, y: layout.container.y },
      { width: layout.container.width, height: layout.container.height },
    );
  }
  if (layout.type === 'container') {
    layout.children.forEach((child, index) => {
      match(child, 'type', {
        container: (container) => {
          renderBox(container);
        },
        text: (text) => {
          if (DEBUG) {
            println(
              text.component.type + ': ' + JSON.stringify(text.container),
            );
          } else {
            drawText(text);
          }
        },
      });
    });
  }
};

export const render = (root: RootContainer): void => {
  clearScreen();

  renderBox(calculateRoot(root));
};
