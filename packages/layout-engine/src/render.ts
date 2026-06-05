import type { RootElement, Text } from './types';
import type { LayoutElement, LayoutRoot, LayoutItem } from './layout';

import { match } from 'match-discriminated-union';

import { EfiFontInfoMask, EfiHiiFontStyle } from '@refi/runtime';
import { calculateRoot } from './layout';

const DEBUG = false;

const renderMarginBorderPadding = (
  layout: LayoutRoot | LayoutElement,
): void => {
  // margin rectangle
  refiGraphics.drawRectangle(
    { r: 0, g: 0, b: 0, a: 0 },
    { x: layout.position.x, y: layout.position.y },
    {
      width: layout.dimensions.totalWidth,
      height: layout.dimensions.totalHeight,
    },
  );
  // border rectangle
  refiGraphics.drawRectangle(
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
  refiGraphics.drawRectangle(
    layout.component.props.style?.bgColor ?? { r: 0, g: 0, b: 0, a: 0 },
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
    refiGraphics.drawRectangle(
      layout.component.props.style?.bgColor ?? { r: 0, g: 0, b: 0, a: 0 },
      layout.position,
      {
        width: layout.dimensions.width,
        height: layout.dimensions.height,
      },
    );
  }
};

const renderText = (item: LayoutItem & { component: Text }) => {
  if (DEBUG) {
    const { dimensions, position, component } = item;
    println(
      `${item.type}: ${JSON.stringify({
        dimensions,
        position,
        text: component.props.text,
      })}\n`,
    );
  } else {
    refiGraphics.drawText(
      item.component.props.text,
      {
        BackgroundColor: item.component.props.style?.bgColor ?? {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
        },
        ForegroundColor: { r: 255, g: 255, b: 255, a: 255 },
        FontInfoMask: [EfiFontInfoMask.EfiFontInfoSysFont],
        FontInfo: {
          fontStyle: EfiHiiFontStyle.EfiHiiFontStyleNormal,
          fontSize: 16,
          FontName: '',
        },
      },
      {
        x:
          item.position.x +
          item.dimensions.margin +
          item.dimensions.border +
          item.dimensions.padding,
        y:
          item.position.y +
          item.dimensions.margin +
          item.dimensions.border +
          item.dimensions.padding,
      },
    );
  }
};

export const render = (root: RootElement): void => {
  if (DEBUG) {
    efi.SystemTable.ConOut.ClearScreen();
  }

  const [layoutRoot, layout] = calculateRoot(root);
  //renderBox(layout, { x: 0, y: 0 });
  refiGraphics.clearFrame();
  renderBox(layoutRoot);
  layout.layers.forEach((layer) => {
    layer.forEach((elm) => {
      match(elm, 'type', {
        container: (container) => {
          renderBox(container);
        },
        item: (item) => {
          renderMarginBorderPadding(item);
          renderText(item as LayoutItem & { component: Text });
        },
      });
    });
  });
  refiGraphics.commitFrame();
};
