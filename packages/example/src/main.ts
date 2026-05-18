import React from 'react';

import { createRoot } from '@refi/uefi-react';

import { App } from './App'

const root = createRoot({});
root.updateRoot(React.createElement(App));

let iters = 0;
try {
  while (__host.hasWork()) {
    __host.tick();
  }
} catch (e) {
  println('error on iteration: ' + iters);
  println(e);
}
println('done after ' + iters + ' iterations');
