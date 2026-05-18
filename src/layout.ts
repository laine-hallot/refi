import type { Element, BoxElement, RootContainer } from './types';

import { match } from 'match-discriminated-union';

type TextContainer = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createTextContainer = (
  position: { x: number; y: number },
  parentContainer: {
    width: number;
    height: number;
  },
): TextContainer => {
  return {
    x: position.x,
    y: position.y,
    width: parentContainer.width,
    height: parentContainer.height,
  };
};

type Container = {
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'column' | 'row';
};

export const createContainer = (
  orientation: 'column' | 'row',
  position: { x: number; y: number },
  parentContainer: {
    width: number;
    height: number;
  },
): Container => {
  return {
    x: position.x,
    y: position.y,
    width: parentContainer.width,
    height: parentContainer.width,
    orientation,
  };
};

const calculatePositionUsingParent = (
  parentOrientation: 'row' | 'column',
  parentPosition: { x: number; y: number },
  siblingsSize: { width: number; height: number },
): { x: number; y: number } => {
  if (parentOrientation === 'column') {
    return {
      x: parentPosition.x,
      y: parentPosition.y + siblingsSize.height,
    };
  } else {
    return {
      x: parentPosition.x + siblingsSize.width,
      y: parentPosition.y,
    };
  }
};

const calculateSizeWithNewChild = (
  parentOrientation: 'column' | 'row',
  siblingsSize: { width: number; height: number },
  childSize: { width: number; height: number },
): { width: number; height: number } => {
  if (parentOrientation === 'column') {
    return {
      height: siblingsSize.height + childSize.height,
      width: Math.max(childSize.width, siblingsSize.width),
    };
  } else {
    return {
      height: Math.max(childSize.height, siblingsSize.height),
      width: siblingsSize.width + childSize.width,
    };
  }
};

type ToLayout<T extends Element> = T extends {
  children: Element[];
}
  ? {
    type: 'container';
    component: Omit<T, 'children'>;
    children: LayoutElement[];
    container: Container;
    childrenContainer: Container;
  }
  : { type: 'text'; component: T; container: TextContainer };

export type LayoutElement = ToLayout<Element>;
export type LayoutRoot = {
  type: 'container';
  component: Omit<RootContainer, 'children'>;
  children: LayoutElement[];
  container: Container;
};

export const calculateElement = (
  elm: Element,
  parentContainer: Container,
): LayoutElement => {
  return match(elm, 'type', {
    box: (box) => calculateBox(box, parentContainer),
    text: (text) => {
      const textContainer = createTextContainer(
        calculatePositionUsingParent(
          parentContainer.orientation,
          { x: parentContainer.x, y: parentContainer.y },
          { width: parentContainer.width, height: parentContainer.height },
        ),
        {
          width: text.props.text.length * 16,
          // assume single line text
          height: 24,
        },
      );

      return {
        type: 'text',
        component: text,
        container: textContainer,
      };
    },
  });
};

const calculateChildren = (
  children: Element[],
  parent: { orientation: 'row' | 'column'; x: number; y: number },
): LayoutElement => {
  const childrenContainer = createContainer(
    parent.orientation,
    { x: 0, y: 0 },
    {
      width: 0,
      height: 0,
    },
  );

  const layoutChildren = children.map((elm) => {
    const layoutElement = calculateElement(elm, childrenContainer);

    const newSize = calculateSizeWithNewChild(
      childrenContainer.orientation,
      { width: childrenContainer.width, height: childrenContainer.height },
      {
        width: layoutElement.container.width,
        height: layoutElement.container.height,
      },
    );
    childrenContainer.width = newSize.width;
    childrenContainer.height = newSize.height;
    return layoutElement;
  });

  return
};

export const calculateRoot = (root: RootContainer): LayoutRoot => {
  const layoutChildren = calculateChildren(root.children, {
    orientation: 'row',
    x: 0,
    y: 0,
  });

  const rootContainer = createContainer(
    'row',
    { x: 0, y: 0 },
    {
      width: root.props.width ?? 0,
      height: root.props.height ?? 0,
    },
  );

  const { children: _reactChildren, ...rest } = root;
  return {
    type: 'container',
    component: rest,
    container: rootContainer,
    children: layoutChildren,
    childrenContainer,
  };
};

export const calculateBox = (
  box: BoxElement,
  parentContainer: Container,
): LayoutElement => {
  const boxContainer = createContainer(
    box.props.orientation ?? 'row',
    calculatePositionUsingParent(
      parentContainer.orientation,
      { x: parentContainer.x, y: parentContainer.y },
      { width: parentContainer.width, height: parentContainer.height },
    ),
    {
      width: 0,
      height: 0,
    },
  );

  const children = box.children.map((child): LayoutElement => {
    const layoutElement = calculateElement(child, boxContainer);

    const newSize = calculateSizeWithNewChild(
      parentContainer.orientation,
      { width: boxContainer.width, height: boxContainer.height },
      {
        width: layoutElement.container.width,
        height: layoutElement.container.height,
      },
    );
    boxContainer.width = newSize.width;
    boxContainer.height = newSize.height;

    return layoutElement;
  });

  if (box.props.width !== undefined && box.props.width > boxContainer.width) {
    boxContainer.width = box.props.width;
  }
  if (
    box.props.height !== undefined &&
    box.props.height > boxContainer.height
  ) {
    boxContainer.height = box.props.height;
  }
  const { children: _reactChildren, ...rest } = box;
  return {
    type: 'container',
    component: rest,
    container: boxContainer,
    children,
  };
};
