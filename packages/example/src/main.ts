import './host-shim.js';
//import './smoke.js'
//
import type {
  BoxElement,
  Element,
  ElementTypes,
  RootContainer,
  TextElement,
} from '@refi/uefi-react';

import React from 'react';
import ReactReconciler, { HostConfig, ReactContext } from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';
import { BetterHostConfig } from '../uefi-react.js';
import { App } from './App.js';
import { render } from './render.js';
import { match } from 'match-discriminated-union';
import { HII } from '../types.js';
import { getScreenSize } from './uefi-graphics.js';

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
