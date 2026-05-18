import type { Element, BoxElement, RootContainer, TextElement } from './types';

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

const createTextContainer = (element: TextElement) => {

}

type Container = ContainerBase & {
  childrenContainer: {
    orientation: 'column' | 'row';
    justifyContent: 'start';
    alignItems: 'start';
  };
};

const containerFromElement = (elm: Extract<Element, { children: Element[] }>): Container => {
  const childrenContainer: Container['childrenContainer'] = {
    alignItems: 'start',
    justifyContent: 'start',
    orientation: 'row'
  };

  return {
    border: 0,
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    x: 0,
    y: 0,
    z: 0,
    childrenContainer
  }
};

const addChildToContainer = (container: Container, child: Element): { container: Container, child: LayoutElement } => {
  match(container.childrenContainer, 'orientation', {
    row: () => {
      const layoutElement = calculateElement(child);
      container.height
    },
    column: () => {

    }
  })
};


const calculateBox = (element: Extract<Element, { children: Element[] }>): Extract<LayoutElement, { type: 'container' }> => {
  const boxContainer = containerFromElement(element);

  const children = element.children.map((elm) => {
    const { container: updatedContainer, child: layoutElement } = addChildToContainer(boxContainer, elm);
    boxContainer.height = updatedContainer.height;
    boxContainer.width = updatedContainer.width;

    return layoutElement;
  });

  return {
    type: 'container',
    children,
    component: element,
    container: boxContainer,
  }


}

const calculateElement = (element: Element): LayoutElement => {
  return match(element, 'type', {
    box: (box) => calculateBox(box),
    text: (text) => {

    },
  });
}


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
export type LayoutRoot = {
  type: 'container';
  component: Omit<RootContainer, 'children'>;
  children: LayoutElement[];
  container: Container;
};

export const calculateRoot = (root: RootContainer): LayoutRoot => { };
