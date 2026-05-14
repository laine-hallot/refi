import type { Element, BoxElement } from './types';

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
    }
  : { type: 'text'; component: T; container: TextContainer };

export type LayoutElement = ToLayout<Element>;

const calculateElement = (
  elm: Element,
  parentContainer: Container,
): LayoutElement => {
  return match(elm, 'type', {
    box: (box) => {
      const childLayout = calculateBox(box, parentContainer);

      return childLayout;
    },
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

  const { children: _reactChildren, ...rest } = box;
  return {
    type: 'container',
    component: rest,
    container: boxContainer,
    children,
  };
};
