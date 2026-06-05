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

export type BoxProps = BaseProps & {
  orientation?: 'row' | 'column';
  separator?: boolean;
  style?: {
    gap?: number;
  };
};
export type Box = {
  type: 'box';
  props: BoxProps;
  children: UefiElement[];
};

export type TextProps = BaseProps & { text: string };

export type Text = {
  type: 'text';
  props: TextProps;
};

export type UefiElement = Box | Text;

export type RootElement = {
  type: 'root';
  props: { style: { width?: number; height?: number; bgColor?: BltPixel } };
  children: UefiElement[];
};
