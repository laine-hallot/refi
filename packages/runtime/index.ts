import './src/polyfills/index.js';

import refiPointer from './src/refi-pointer';
export type { PointerInfo } from './src/refi-pointer';

export * from './external/promethee/types';
export { getScreenSize } from './src/graphics';
export { refiPointer };
