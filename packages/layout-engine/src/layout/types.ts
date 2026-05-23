import { UefiElement } from '../types';
import type { Dimensions } from './dimensions';

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type LayoutElmBase = {
  position: Position;
  dimensions: Dimensions;
};

export type LayoutText = {
  type: 'text';
  componentProps: Exclude<UefiElement, { children: UefiElement[] }>['props'];
} & LayoutElmBase;

type ToLayout<T extends UefiElement> = T extends {
  children: UefiElement[];
}
  ? LayoutContainer
  : LayoutText;

export type LayoutElement = ToLayout<UefiElement>;

export type LayoutContainer = LayoutElmBase & {
  type: 'container';
  containerOptions: {
    orientation: 'column' | 'row';
    justifyContent: 'start';
    alignItems: 'start';
    gap: number;
  };
  children: LayoutElement[];
  componentProps: Extract<UefiElement, { children: UefiElement[] }>['props'];
};
