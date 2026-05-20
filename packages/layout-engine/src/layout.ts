import type { UefiElement, RootElement } from '@refi/uefi-react';

import { match } from 'match-discriminated-union';

type ContainerBase = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  margin: number;
  border: number;
  padding: number;
};
type TextContainer = ContainerBase & {};

type Container = ContainerBase & {
  childrenContainer: {
    orientation: 'column' | 'row';
    justifyContent: 'start';
    alignItems: 'start';
    gap: number;
  };
};

const containerFromElement = (
  elm: Extract<UefiElement, { children: UefiElement[] }>,
  recursionDepth: number,
): Container => {
  const childrenContainer: Container['childrenContainer'] = {
    alignItems: 'start',
    justifyContent: 'start',
    orientation: elm.props.orientation ?? 'row',
    gap: elm.props.gap ?? 0,
  };

  return {
    border: elm.props.border ?? 0,
    height: 0,
    width: 0,
    margin: elm.props.margin ?? 0,
    padding: elm.props.padding ?? 0,
    x: 0,
    y: 0,
    z: recursionDepth,
    childrenContainer,
  };
};

const totalSize = (container: Container | TextContainer) => {
  return {
    width:
      container.width +
      container.border * 2 +
      container.padding * 2 +
      container.margin * 2,
    height:
      container.height +
      container.border * 2 +
      container.padding * 2 +
      container.margin * 2,
  };
};

const addChildToContainerChildren = (
  container: Container,
  child: UefiElement,
  recursionDepth: number,
): {
  update: { width: number; height: number };
  child: LayoutElement;
} => {
  return match(container.childrenContainer, 'orientation', {
    row: () => {
      const layoutElement = calculateElement(child, recursionDepth + 1);
      layoutElement.container.x = container.width;

      const size = totalSize(layoutElement.container);

      return {
        update: {
          width: container.width + size.width,
          height:
            size.height > container.height ? container.height : size.height,
        },
        child: layoutElement,
      };
    },
    column: () => {
      const layoutElement = calculateElement(child, recursionDepth + 1);
      layoutElement.container.y = container.height;

      const size = totalSize(layoutElement.container);

      return {
        update: {
          width: size.width > container.width ? container.width : size.width,
          height: container.height + size.height,
        },
        child: layoutElement,
      };
    },
  });
};

const calculateBox = (
  element: Extract<UefiElement, { children: UefiElement[] }>,
  recursionDepth: number,
): Extract<LayoutElement, { type: 'container' }> => {
  const boxContainer = containerFromElement(element, recursionDepth);

  const children = element.children.map((elm) => {
    const { update: updatedSize, child } = addChildToContainerChildren(
      boxContainer,
      elm,
      recursionDepth,
    );

    boxContainer.height = updatedSize.height;
    boxContainer.width = updatedSize.width;

    return child;
  });

  const size = totalSize(boxContainer);

  boxContainer.width = size.width;
  boxContainer.height = size.height;

  return {
    type: 'container',
    children,
    component: element,
    container: boxContainer,
  };
};

const calculateText = (
  element: Extract<UefiElement, { type: 'text' }>,
  recursionDepth: number,
): Extract<LayoutElement, { type: 'text' }> => {
  const textContainer: TextContainer = {
    border: element.props.border ?? 0,
    margin: element.props.margin ?? 0,
    padding: element.props.padding ?? 0,
    x: 0,
    y: 0,
    z: recursionDepth,
    // assume single line text
    height: element.props.height ?? 19,
    width: element.props.text.length * 8,
  };

  const size = totalSize(textContainer);

  textContainer.width = size.width;
  textContainer.height = size.height;

  return {
    type: 'text',
    component: element,
    container: textContainer,
  };
};

const calculateElement = (
  element: UefiElement,
  recursionDepth: number,
): LayoutElement => {
  return match(element, 'type', {
    box: (box) => calculateBox(box, recursionDepth),
    text: (text) => calculateText(text, recursionDepth),
  });
};

type ToLayout<T extends UefiElement> = T extends {
  children: UefiElement[];
}
  ? {
      type: 'container';
      component: Omit<T, 'children'>;
      children: LayoutElement[];
      container: Container;
    }
  : { type: 'text'; component: T; container: TextContainer };

export type LayoutElement = ToLayout<UefiElement>;
export type LayoutRoot = {
  type: 'container';
  component: Omit<RootElement, 'children'>;
  children: LayoutElement[];
  container: Container;
};

export const calculateRoot = (root: RootElement): LayoutRoot => {
  const boxContainer: Container = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    z: 0,
    border: 0,
    margin: 0,
    padding: 0,
    childrenContainer: {
      alignItems: 'start',
      justifyContent: 'start',
      gap: 0,
      orientation: 'row',
    },
  };

  const children = root.children.map((elm) => {
    const { update: updatedSize, child } = addChildToContainerChildren(
      boxContainer,
      elm,
      0,
    );
    boxContainer.height = updatedSize.height;
    boxContainer.width = updatedSize.width;
    return child;
  });

  const size = totalSize(boxContainer);

  boxContainer.width = root.props.width ?? size.width;
  boxContainer.height = root.props.height ?? size.height;

  return {
    type: 'container',
    children,
    component: root,
    container: boxContainer,
  };
};
