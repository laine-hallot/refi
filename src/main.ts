import './host-shim.js';
//import './smoke.js'

import React from 'react';
import ReactReconciler, { HostConfig, ReactContext } from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';
import { BetterHostConfig } from '../uefi-react.js';
import { App } from './App.js';
import {
  BoxElement,
  Element,
  ElementTypes,
  RootContainer,
  TextElement,
} from './types.js';
import { render } from './render.js';
import { match } from 'match-discriminated-union';

const hostContext = {};
const hostTransitionContext: ReactContext<any> = {};

const reconciler = ReactReconciler<
  ElementTypes,
  TextElement['props'] | BoxElement['props'],
  RootContainer,
  Element,
  never,
  never,
  never,
  unknown,
  unknown,
  typeof hostContext,
  Element[],
  unknown,
  unknown,
  typeof hostTransitionContext
>({
  supportsMutation: false as const,
  supportsPersistence: true as const,
  startSuspendingCommit() {
    //println('startSuspendingCommit');
  },
  resolveUpdatePriority() {
    //println('resolveUpdatePriority');
    return DefaultEventPriority;
  },
  detachDeletedInstance(node) {
    //println('detachDeletedInstance', node.type);
  },
  createInstance(type, props) {
    //println('createInstance', type);
    switch (type) {
      case 'text':
        return { type: 'text', props } as TextElement;
      case 'box':
        return { type: 'box', props, children: [] } as BoxElement;
      default:
        throw new Error('Unknown component: ' + type);
    }
  },
  createTextInstance(text) {
    //println('createTextInstance')
    throw new Error('Text must be enclosed in Text component');
  },
  appendInitialChild(parent, child) {
    //println('appendInitialChild');
    if ('children' in parent) {
      parent.children.push(child);
    }
  },
  finalizeInitialChildren() {
    //efi.SystemTable.ConOut.ClearScreen();
    //println('finalizeInitialChildren');
    return false;
  },
  shouldSetTextContent() {
    //println('shouldSetTextContent');
    return false;
  },
  getRootHostContext() {
    //println('getRootHostContext');
    return {};
  },
  getChildHostContext() {
    //println('getChildHostContext');
    return {};
  },
  getPublicInstance(i) {
    //println('getPublicInstance');
    return i;
  },
  prepareForCommit() {
    //println('prepareForCommit');
    return null;
  },
  resetAfterCommit() {
    //println('resetAfterCommit');
  },
  trackSchedulerEvent() {
    //println('trackSchedulerEvent')
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  supportsMicrotasks: true,
  scheduleMicrotask: (fn) => {
    //println('scheduleMicrotask');
    queueMicrotask(fn);
  },
  resolveEventTimeStamp() {
    //println('resolveEventTimeStamp');
    return performance.now();
  },
  resolveEventType() {
    //println('resolveEventType');
    return null;
  },
  preparePortalMount(containerInfo) {
    //println('containerInfo')
  },
  getInstanceFromNode(node) {
    //println('getInstanceFromNode')
    return null;
  },
  beforeActiveInstanceBlur() {
    //println('beforeActiveInstanceBlur')
  },
  afterActiveInstanceBlur() {
    //println('afterActiveInstanceBlur')
  },
  prepareScopeUpdate(_scopeInstance, _instance) {
    //println('prepareScopeUpdate')
  },
  getInstanceFromScope(_scopeInstance) {
    //println('getInstanceFromScope')
    throw Error('getInstanceFromScope - not implemented');
  },
  NotPendingTransition: null,
  HostTransitionContext: hostTransitionContext,
  resetFormInstance(_form) {
    //println('resetFormInstance')
  },
  requestPostPaintCallback(_callback) {
    //println('requestPostPaintCallback')
  },
  shouldAttemptEagerTransition() {
    //println('shouldAttemptEagerTransition');
    return false;
  },
  maySuspendCommit(type, props) {
    //println('maySuspendCommit');
    return false;
  },
  preloadInstance(type, props) {
    //println('preloadInstance');
    return false;
  },
  suspendInstance(type, props) {
    //println('suspendInstance')
  },
  waitForCommitToBeReady() {
    //println('waitForCommitToBeReady')
    return null;
  },
  setCurrentUpdatePriority(newPriority) { },
  getCurrentUpdatePriority() {
    return DefaultEventPriority;
  },
  supportsHydration: false,
  cloneInstance(
    instance,
    type,
    oldProps,
    newProps,
    keepChildren,
    recyclableInstance,
  ) {
    return match(instance, 'type', {
      text: (text) => {
        return {
          type,
          props: { ...oldProps, ...newProps },
        };
      },
      box: (box) => {
        return {
          type,
          props: { ...oldProps, ...newProps },
          children: keepChildren ? box.children : [],
        };
      },
    });
  },
  createContainerChildSet(container) {
    //println('createContainerChildSet');
    return [];
  },
  appendChildToContainerChildSet(childSet, child) {
    //println('appendChildToContainerChildSet');
    childSet.push(child);
  },
  finalizeContainerChildren(container, newChildren) {
    // println('finalizeContainerChildren')
    render(container);
  },
  replaceContainerChildren(container, newChildren) {
    container.children = newChildren;
  },
  cloneHiddenInstance(instance, type, props, internalInstanceHandle) {
    return instance;
  },
  cloneHiddenTextInstance(instance, type, internalInstanceHandle) {
    throw new Error('Tried to clone unsupported element');
  },
});

const container = { type: 'root' as const, children: [] };
const root = reconciler.createContainer(
  container,
  0,
  null,
  false,
  null,
  '',
  (e) => {
    console.error(e);
  },
  null,
  (error) => {
    console.error(error);
    console.error(error.message);
  },
  () => { },
);
reconciler.updateContainer(React.createElement(App), root, null, null);

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
