import React from 'react';

import { createRoot } from '@refi/uefi-react';

import { App } from './App';

const root = createRoot({});
root.updateRoot(React.createElement(App));

let iters = 0;
try {
  while (__host.hasWork()) {
    __host.tick();
  }
} catch (e) {
  console.error('error on iteration: ' + iters);
  console.error(e);
  Array;
}
println('done after ' + iters + ' iterations');
