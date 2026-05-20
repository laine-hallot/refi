import { BltPixel } from '../types';

export type BaseProps = {
  width?: number;
  height?: number;
  bgColor?: BltPixel;
  padding?: number;
  margin?: number;
  border?: number;
};
export type BoxElement = {
  type: 'box';
  props: BaseProps & {
    orientation?: 'row' | 'column';
    separator?: boolean;
    gap?: number;
  };
  children: Element[];
};
export type TextElement = {
  type: 'text';
  props: BaseProps & { text: string };
};
export type Element = BoxElement | TextElement;
export type ElementTypes = Element['type'];

export type RootContainer = {
  type: 'root';
  props: { width?: number; height?: number; bgColor?: BltPixel };
  children: Element[];
};
