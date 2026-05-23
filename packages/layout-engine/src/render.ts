import type { RootElement } from './types';
import type { LayoutElement, LayoutRoot } from './layout';

import { match } from 'match-discriminated-union';

import { calculateRoot } from './layout';
import { clearScreen, drawRectangle, drawText } from './uefi-graphics';

const DEBUG = true;

const renderMarginBorderPadding = (
  layout: LayoutRoot | LayoutElement,
  parent: { x: number; y: number },
): void => {
  // margin rectangle
  drawRectangle(
    { r: 0, g: 0, b: 0, a: 0 },
    { x: layout.position.x, y: layout.position.y },
    {
      width: layout.dimensions.totalWidth,
      height: layout.dimensions.totalHeight,
    },
  );
  // border rectangle
  drawRectangle(
    { r: 255, g: 255, b: 255, a: 255 },
    {
      x: layout.position.x + layout.dimensions.margin,
      y: layout.position.y + layout.dimensions.margin,
    },
    {
      width:
        layout.dimensions.width +
        layout.dimensions.border * 2 +
        layout.dimensions.padding * 2,
      height:
        layout.dimensions.height +
        layout.dimensions.border * 2 +
        layout.dimensions.padding * 2,
    },
  );
  // padding rectangle
  drawRectangle(
    { r: 0, g: 0, b: 0, a: 0 },
    {
      x:
        layout.position.x + layout.dimensions.margin + layout.dimensions.border,
      y:
        layout.position.y + layout.dimensions.margin + layout.dimensions.border,
    },
    {
      width: layout.dimensions.width + layout.dimensions.padding * 2,
      height: layout.dimensions.height + layout.dimensions.padding * 2,
    },
  );
};

const renderBox = (
  layout: LayoutRoot | LayoutElement,
  parent: { x: number; y: number },
): void => {
  if (DEBUG) {
    println(layout.type + ': ' + JSON.stringify(layout));
  } else {
    layout.position.x = parent.x + layout.position.x;
    layout.position.y = parent.y + layout.position.y;
    renderMarginBorderPadding(layout, parent);
    // content rectangle
    drawRectangle(
      layout.componentProps.style?.bgColor ?? { r: 0, g: 0, b: 0, a: 0 },
      { x: parent.x + layout.position.x, y: parent.y + layout.position.y },
      {
        width: layout.dimensions.width,
        height: layout.dimensions.height,
      },
    );
  }
  if (layout.type === 'container') {
    layout.children.forEach((child) => {
      match(child, 'type', {
        container: (container) => {
          renderBox(container, {
            x: parent.x + container.position.x,
            y: parent.y + container.position.y,
          });
        },
        text: (text) => {
          text.position.x = parent.x + text.position.x;
          text.position.y = parent.y + text.position.y;
          if (DEBUG) {
            println(text.type + ': ' + JSON.stringify(text));
          } else {
            renderMarginBorderPadding(text, parent);

            drawText(text, {
              x:
                text.position.x +
                text.dimensions.margin +
                text.dimensions.border +
                text.dimensions.padding,
              y:
                text.position.y +
                text.dimensions.margin +
                text.dimensions.border +
                text.dimensions.padding,
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
