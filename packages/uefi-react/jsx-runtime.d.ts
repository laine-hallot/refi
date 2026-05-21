import type { BoxElement, TextElement, UefiElement } from '@refi/layout-engine';

import type { UefiNode } from './src/types';

type Intrinsic<T extends UefiElement> = T extends {
  children: UefiElement[];
}
  ? T['props'] & { children: UefiNode | UefiNode[] }
  : T['props'];

export namespace JSX {
  function jsx(): any;
  type jsxs = typeof jsx;
  type jsxDEV = typeof jsx;
  type Element = UefiNode;
  type IntrinsicElements = {
    box: Intrinsic<BoxElement>;
    text: Intrinsic<TextElement>;
  };
}
