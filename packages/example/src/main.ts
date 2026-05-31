import React from 'react';

import { createRoot } from '@refi/uefi-react';

import { App } from './App';

const root = createRoot({});
root.updateRoot(React.createElement(App));

refiInput.addKbEvent({ id: '' }, (event) => {
  console.log(String.fromCharCode(event.key.unicodeChar));
});

println('done');
