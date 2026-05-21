import { UefiElement } from '@refi/layout-engine';

export type UefiNode = UefiElement | null | undefined;

export type FunctionComponent<P = {}> = (props: P) => UefiNode;
export type FC<P = {}> = FunctionComponent<P>;
