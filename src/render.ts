import { match } from 'match-discriminated-union';
import { BltOperation, BltPixel, GraphicsOutputProtocol } from '../types';
import {
  Element,
  BoxElement,
  TextElement,
  ElementTypes,
  RootContainer,
} from './types';
import { drawRectangle } from './uefi-graphics';
import { calculateBox, createContainer, LayoutElement } from './layout';

const HORIZONTAL_SEPARATOR = ' | ';
const VERTICAL_SEPARATOR = '------------------------------';

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

// const drawText = () => {
//   let text_width = child.props.text.length * 16;
//   let text_height = 24;
//   drawRectangle(
//     getColor(),
//     { x: container.x, y: container.y },
//     { width: text_width, height: text_height },
//   );
// };

const DEBUG = false;

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
            drawRectangle(
              colorOrderText[index] ?? colorOrderText[0],
              { x: text.container.x, y: text.container.y },
              { width: text.container.width, height: text.container.height },
            );
          }
        },
      });
    });
  }
};

export const render = (container: RootContainer): void => {
  efi.SystemTable.ConOut.ClearScreen();

  container.children.forEach((child) => {
    match(child, 'type', {
      text: (text) => {
        //renderText(child);
      },
      box: (box) => {
        const container = createContainer(
          box.props.orientation ?? 'row',
          { x: 0, y: 0 },
          {
            width: 0,
            height: 0,
          },
        );
        const layout = calculateBox(box, container);
        renderBox(layout);
      },
    });
  });
  colorIndex = 0;
};
