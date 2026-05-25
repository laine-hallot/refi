import type { RootElement } from './types';
import type { LayoutElement, LayoutRoot } from './layout';

import { match } from 'match-discriminated-union';

import { calculateRoot } from './layout';
import { clearScreen, drawRectangle, drawText } from './uefi-graphics';

const DEBUG = false;

const renderMarginBorderPadding = (
  layout: LayoutRoot | LayoutElement,
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

const renderBox = (layout: LayoutRoot | LayoutElement): void => {
  if (DEBUG) {
    const { dimensions, position } = layout;
    println(`${layout.type}: ${JSON.stringify({ dimensions, position })}\n`);
  } else {
    renderMarginBorderPadding(layout);
    // content rectangle
    drawRectangle(
      layout.componentProps.style?.bgColor ?? { r: 0, g: 0, b: 0, a: 0 },
      layout.position,
      {
        width: layout.dimensions.width,
        height: layout.dimensions.height,
      },
    );
  }
};

export const render = (root: RootElement): void => {
  if (DEBUG) {
    efi.SystemTable.ConOut.ClearScreen();
  } else {
    clearScreen();
  }

  const [_layoutRoot, layout] = calculateRoot(root);
  //renderBox(layout, { x: 0, y: 0 });
  layout.layers.forEach((layer) => {
    layer.forEach((elm) => {
      match(elm, 'type', {
        container: (container) => {
          renderBox(container);
        },
        text: (text) => {
          if (DEBUG) {
            const { dimensions, position, componentProps } = text;
            println(
              `${text.type}: ${JSON.stringify({
                dimensions,
                position,
                text: componentProps.text,
              })}\n`,
            );
          } else {
            renderMarginBorderPadding(text);

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
  });
};
