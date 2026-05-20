import type { BltPixel, HIIFont } from '../types';
import type { RootElement } from './types';

import { match } from 'match-discriminated-union';

import { calculateRoot, LayoutElement, LayoutRoot } from '@refi/layout-engine';

import { clearScreen, drawRectangle, drawText } from './uefi-graphics';

const DEBUG = false;

const renderMarginBorderPadding = (
  layout: LayoutRoot | LayoutElement,
  parent: { x: number; y: number },
): void => {
  // margin rectangle
  drawRectangle(
    { r: 0, g: 0, b: 0, a: 0 },
    { x: layout.container.x, y: layout.container.y },
    { width: layout.container.width, height: layout.container.height },
  );
  // border rectangle
  drawRectangle(
    { r: 255, g: 255, b: 255, a: 255 },
    {
      x: layout.container.x + layout.container.margin,
      y: layout.container.y + layout.container.margin,
    },
    {
      width: layout.container.width - layout.container.margin * 2,
      height: layout.container.height - layout.container.margin * 2,
    },
  );
  // padding rectangle
  drawRectangle(
    { r: 0, g: 0, b: 0, a: 0 },
    {
      x: layout.container.x + layout.container.margin + layout.container.border,
      y: layout.container.y + layout.container.margin + layout.container.border,
    },
    {
      width:
        layout.container.width -
        layout.container.margin * 2 -
        layout.container.border * 2,
      height:
        layout.container.height -
        layout.container.margin * 2 -
        layout.container.border * 2,
    },
  );
};

const renderBox = (
  layout: LayoutRoot | LayoutElement,
  parent: { x: number; y: number },
): void => {
  if (DEBUG) {
    println(layout.type + ': ' + JSON.stringify(layout.container));
  } else {
    layout.container.x = parent.x + layout.container.x;
    layout.container.y = parent.y + layout.container.y;
    renderMarginBorderPadding(layout, parent);
    // content rectangle
    drawRectangle(
      layout.component.props.style?.bgColor ?? { r: 0, g: 0, b: 0, a: 0 },
      { x: parent.x + layout.container.x, y: parent.y + layout.container.y },
      {
        width:
          layout.container.width -
          layout.container.margin * 2 -
          layout.container.border * 2 -
          layout.container.padding * 2,
        height:
          layout.container.height -
          layout.container.margin * 2 -
          layout.container.border * 2 -
          layout.container.padding * 2,
      },
    );
  }
  if (layout.type === 'container') {
    layout.children.forEach((child) => {
      match(child, 'type', {
        container: (container) => {
          renderBox(container, {
            x: parent.x + container.container.x,
            y: parent.y + container.container.y,
          });
        },
        text: (text) => {
          text.container.x = parent.x + text.container.x;
          text.container.y = parent.y + text.container.y;
          if (DEBUG) {
            println(
              text.component.type + ': ' + JSON.stringify(text.container),
            );
          } else {
            renderMarginBorderPadding(text, parent);

            drawText(text, {
              x:
                text.container.x +
                text.container.margin +
                text.container.border +
                text.container.padding,
              y:
                text.container.y +
                text.container.margin +
                text.container.border +
                text.container.padding,
            });
          }
        },
      });
    });
  }
};

export const render = (root: RootElement): void => {
  if (DEBUG) {
    efi.SystemTable.ConOut.ClearScreen();
  } else {
    clearScreen();
  }

  const layout = calculateRoot(root);
  renderBox(layout, { x: 0, y: 0 });
};
