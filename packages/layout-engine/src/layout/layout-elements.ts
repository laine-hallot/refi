import type { LayoutContainer, LayoutElement } from './types';
import type { UefiElement } from '../types';
import { match } from 'match-discriminated-union';

import { createDimensions } from './dimensions';
import { LayoutRoot } from './root-layout';
import { Position } from './position';

export const manageChildren = <T extends LayoutContainer | LayoutRoot>(
  container: T,
): { container: T; addChild: (child: UefiElement) => void } => {
  const addChild = (child: UefiElement) => {
    const childPosition: Position = match(
      container.containerOptions,
      'orientation',
      {
        column: () => ({
          x: container.position.x,
          y: container.position.y + container.dimensions.height,
          z: container.position.z + 1,
        }),
        row: () => ({
          x: container.position.x + container.dimensions.width,
          y: container.position.y,
          z: container.position.z + 1,
        }),
      },
    );
    const layoutElement = calculateElementContent(child, childPosition);
    match(container.containerOptions, 'orientation', {
      column: () => {
        container.dimensions.height =
          container.dimensions.height + layoutElement.dimensions.totalHeight;

        if (layoutElement.dimensions.width > container.dimensions.width) {
          container.dimensions.width = layoutElement.dimensions.width;
        }
      },
      row: () => {
        container.dimensions.width =
          container.dimensions.width + layoutElement.dimensions.totalWidth;

        if (layoutElement.dimensions.height > container.dimensions.height) {
          container.dimensions.height = layoutElement.dimensions.height;
        }
      },
    });
    container.children.push(layoutElement);
  };
  return { container, addChild };
};

const createContainer = (
  elmProps: Extract<UefiElement, { children: UefiElement[] }>['props'],
  position: Position,
): LayoutContainer => ({
  type: 'container',
  dimensions: createDimensions(elmProps.style),
  position,
  containerOptions: {
    alignItems: 'start',
    justifyContent: 'start',
    orientation: elmProps.orientation ?? 'row',
    gap: elmProps.gap ?? 0,
  },
  componentProps: elmProps,
  children: [],
});

const calculateBox = (
  element: Extract<UefiElement, { children: UefiElement[] }>,
  position: Position,
): LayoutContainer => {
  const { container, addChild } = manageChildren(
    createContainer(element.props, position),
  );

  element.children.forEach((elm) => {
    addChild(elm);
  });

  return container;
};

const calculateText = (
  element: Extract<UefiElement, { type: 'text' }>,
  position: Position,
): Extract<LayoutElement, { type: 'text' }> => {
  return {
    type: 'text',
    dimensions: createDimensions({
      ...element.props.style,
      // assume single line text
      height: element.props.style?.height ?? 19,
      width: element.props.style?.width ?? element.props.text.length * 8,
    }),
    position,
    componentProps: element.props,
  };
};

export const calculateElementContent = (
  element: UefiElement,
  position: Position,
): LayoutElement => {
  return match(element, 'type', {
    box: (box) => calculateBox(box, position),
    text: (text) => calculateText(text, position),
  });
};
