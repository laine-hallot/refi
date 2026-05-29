import React from 'react';

import { createRoot } from '@refi/uefi-react';

import { App } from './App';

const root = createRoot({});
root.updateRoot(React.createElement(App));

println('done');
