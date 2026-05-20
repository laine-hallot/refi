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
  children: UefiElement[];
};
export type TextElement = {
  type: 'text';
  props: BaseProps & { text: string };
};
export type UefiElement = BoxElement | TextElement;
export type ElementTypes = UefiElement['type'];

export type UefiNode = UefiElement | null | undefined;

export type FunctionComponent<P = {}> = (props: P) => UefiNode;
export type FC<P = {}> = FunctionComponent<P>;

export type RootElement = {
  type: 'root';
  props: { width?: number; height?: number; bgColor?: BltPixel };
  children: UefiElement[];
};
