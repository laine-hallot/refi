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
export type LayoutItem = {
  type: 'item';
  component: Exclude<UefiElement, { children: UefiElement[] }>;
} & LayoutElmBase;

type ToLayout<T extends UefiElement> = T extends {
  children: UefiElement[];
}
  ? LayoutContainer
  : LayoutItem;

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
  component: Pick<
    Extract<UefiElement, { children: UefiElement[] }>,
    'props' | 'type'
  >;
};

export type LayoutLayer = LayoutElement[];
export type Layout = { layers: LayoutLayer[] };
