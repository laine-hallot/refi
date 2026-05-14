import type ReactReconciler from 'react-reconciler';
import type {
  BoxElement,
  Element,
  TextElement,
  Element as UefiElement,
} from './src/types';

type Intrinsic<T extends Element> = T extends {
  children: (Element | undefined | null)[];
}
  ? T['props'] & { children: T['children'] }
  : T['props'];

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      box: Intrinsic<BoxElement>;
      text: Intrinsic<TextElement>;
    }
  }
}
