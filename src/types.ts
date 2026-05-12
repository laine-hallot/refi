export type BaseProps = {};
export type BoxElement = { type: 'box', props: BaseProps & { orientation: 'row' | 'column', separator: boolean }, children: Element[] };
export type TextElement = { type: 'text', props: BaseProps & { text: string }, children: Element[] };
export type Element = BoxElement | TextElement;
export type ElementTypes = Element['type'];
