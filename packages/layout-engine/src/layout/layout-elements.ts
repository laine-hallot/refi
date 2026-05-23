import type { LayoutContainer, LayoutElement } from './types';
import type { UefiElement } from '../types';
import { match } from 'match-discriminated-union';

import { createDimensions } from './dimensions';
import { LayoutRoot } from './root-layout';

export const manageChildren = <T extends LayoutContainer | LayoutRoot>(
  container: T,
): { container: T; addChild: (child: UefiElement) => void } => {
  const addChild = (child: UefiElement) => {
    const layoutElement = calculateElement(child, container.position.z + 1);
    match(container.containerOptions, 'orientation', {
      column: () => {
        layoutElement.position.y = container.dimensions.height;
        container.dimensions.height =
          container.dimensions.height + layoutElement.dimensions.totalWidth;

        if (layoutElement.dimensions.width > container.dimensions.width) {
          container.dimensions.width = layoutElement.dimensions.width;
        }
      },
      row: () => {
        layoutElement.position.x = container.dimensions.width;
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
  recursionDepth: number,
): LayoutContainer => ({
  type: 'container',
  dimensions: createDimensions(elmProps.style),
  position: {
    x: 0,
    y: 0,
    z: recursionDepth,
  },
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
  recursionDepth: number,
): LayoutContainer => {
  const { container, addChild } = manageChildren(
    createContainer(element.props, recursionDepth),
  );

  element.children.forEach((elm) => {
    addChild(elm);
  });

  return container;
};

const calculateText = (
  element: Extract<UefiElement, { type: 'text' }>,
  recursionDepth: number,
): Extract<LayoutElement, { type: 'text' }> => {
  return {
    type: 'text',
    dimensions: createDimensions({
      ...element.props.style,
      // assume single line text
      height: element.props.style?.height ?? 19,
      width: element.props.style?.width ?? element.props.text.length * 8,
    }),
    position: {
      x: 0,
      y: 0,
      z: recursionDepth,
    },
    componentProps: element.props,
  };
};

export const calculateElement = (
  element: UefiElement,
  recursionDepth: number,
): LayoutElement => {
  return match(element, 'type', {
    box: (box) => calculateBox(box, recursionDepth),
    text: (text) => calculateText(text, recursionDepth),
  });
};
