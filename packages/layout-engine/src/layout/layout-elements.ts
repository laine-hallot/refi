import type { Layout, LayoutContainer, LayoutElement } from './types';
import type { UefiElement } from '../types';
import { match } from 'match-discriminated-union';

import { createDimensions } from './dimensions';
import { LayoutRoot } from './root-layout';
import { Position } from './position';

const calculateGap = (
  childrenLength: number,
  containerOptions: (LayoutContainer | LayoutRoot)['containerOptions'],
) => {
  if (childrenLength <= 0) {
    return 0;
  } else {
    return 'gap' in containerOptions ? containerOptions.gap : 0;
  }
};

export const manageChildren = <T extends LayoutContainer | LayoutRoot>(
  container: T,
): { container: T; addChild: (child: UefiElement, layout: Layout) => void } => {
  const addChild = (child: UefiElement, layout: Layout) => {
    const gap = calculateGap(
      container.children.length,
      container.containerOptions,
    );

    const childPosition: Position = match(
      container.containerOptions,
      'orientation',
      {
        column: () => ({
          x: container.position.x,
          y: container.position.y + container.dimensions.height + gap,
          z: container.position.z + 1,
        }),
        row: () => ({
          x: container.position.x + container.dimensions.width + gap,
          y: container.position.y,
          z: container.position.z + 1,
        }),
      },
    );
    const layoutElement = calculateElementContent(child, childPosition, layout);
    match(container.containerOptions, 'orientation', {
      column: () => {
        container.dimensions.height =
          container.dimensions.height +
          layoutElement.dimensions.totalHeight +
          gap;

        if (layoutElement.dimensions.width > container.dimensions.width) {
          container.dimensions.width = layoutElement.dimensions.width;
        }
      },
      row: () => {
        container.dimensions.width =
          container.dimensions.width +
          layoutElement.dimensions.totalWidth +
          gap;

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
    gap: elmProps.style?.gap ?? 0,
  },
  component: { type: 'box', props: elmProps },
  children: [],
});

const calculateBox = (
  element: Extract<UefiElement, { children: UefiElement[] }>,
  position: Position,
  layout: Layout,
): LayoutContainer => {
  const { container, addChild } = manageChildren(
    createContainer(element.props, position),
  );

  element.children.forEach((elm) => {
    addChild(elm, layout);
  });

  if (layout.layers[container.position.z] === undefined) {
    layout.layers[container.position.z] = [];
  }
  layout.layers[container.position.z].push(container);

  return container;
};

const calculateItem = (
  element: Exclude<UefiElement, { children: UefiElement[] }>,
  position: Position,
  layout: Layout,
): Extract<LayoutElement, { type: 'item' }> => {
  const layoutElement: Extract<LayoutElement, { type: 'item' }> = {
    type: 'item' as const,
    component: element,
    dimensions: createDimensions({
      ...element.props.style,
      // assume single line text
      height: element.props.style?.height ?? 19,
      width: element.props.style?.width ?? element.props.text.length * 8,
    }),
    position,
  };

  if (layout.layers[layoutElement.position.z] === undefined) {
    layout.layers[layoutElement.position.z] = [];
  }
  layout.layers[layoutElement.position.z].push(layoutElement);
  return layoutElement;
};

export const calculateElementContent = (
  element: UefiElement,
  position: Position,
  layout: Layout,
): LayoutElement => {
  return match(element, 'type', {
    box: (box) => calculateBox(box, position, layout),
    text: (text) => calculateItem(text, position, layout),
  });
};
