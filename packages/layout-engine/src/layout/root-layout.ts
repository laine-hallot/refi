import type { RootElement } from '../types';
import type { Layout, LayoutElement, LayoutElmBase } from './types';

import { manageChildren } from './layout-elements';
import { createDimensions } from './dimensions';

export type LayoutRoot = LayoutElmBase & {
  type: 'container';
  component: { type: 'root'; props: RootElement['props'] };
  children: LayoutElement[];
  containerOptions: {
    orientation: 'row';
    justifyContent: 'start';
    alignItems: 'start';
  };
};

const createLayoutRoot = (elmProps: RootElement['props']): LayoutRoot => ({
  type: 'container',
  dimensions: createDimensions(elmProps.style),
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  containerOptions: {
    alignItems: 'start',
    justifyContent: 'start',
    orientation: 'row',
  },
  component: { type: 'root', props: elmProps },
  children: [],
});

export const calculateRoot = (root: RootElement): [LayoutRoot, Layout] => {
  const layout = { layers: [] };
  const { container, addChild } = manageChildren(
    createLayoutRoot({
      ...root.props,
      style: { ...root.props.style, width: 0, height: 0 },
    }),
  );

  root.children.forEach((elm) => {
    addChild(elm, layout);
  });

  container.dimensions.height =
    root.props.style?.height ?? container.dimensions.height;
  container.dimensions.width =
    root.props.style?.width ?? container.dimensions.width;

  return [container, layout];
};
