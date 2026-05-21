import type { BltPixel } from '@refi/runtime';

export type Style = {
  width?: number;
  height?: number;
  bgColor?: BltPixel;
  padding?: number;
  margin?: number;
  border?: number;
};

export type BaseProps = {
  style?: Style;
};

export type BoxElement = {
  type: 'box';
  props: BaseProps & {
    orientation?: 'row' | 'column';
    separator?: boolean;
    gap?: number;
  };
  children: UefiElement[];
};
export type TextElement = {
  type: 'text';
  props: BaseProps & { text: string };
};
export type UefiElement = BoxElement | TextElement;
export type ElementTypes = UefiElement['type'];

export type RootElement = {
  type: 'root';
  props: { style: { width?: number; height?: number; bgColor?: BltPixel } };
  children: UefiElement[];
};
