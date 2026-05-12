import './host-shim.js';
//import './smoke.js'

import React from 'react';
import ReactReconciler, { HostConfig } from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';
import { BetterHostConfig } from '../reconciler-type.js';
import { App } from './App.js';
import { BaseProps, Element, ElementTypes } from './types.js';
import { render } from './render.js';

const hostConfig = {
  supportsMutation: false as const,
  supportsPersistence: true as const,
  startSuspendingCommit() {
    //console.log('startSuspendingCommit');
  },
  resolveUpdatePriority() {
    //console.log('resolveUpdatePriority');
    return DefaultEventPriority;
  },
  detachDeletedInstance(node) {
    //console.log('detachDeletedInstance', node.type);
  },
  createInstance(type, props) {
    //console.log('createInstance', type);
    switch (type) {
      case 'text':
      case 'box':
      default:
        return { type, props, children: [] };
    }
  },
  createTextInstance(text) {
    //console.log('createTextInstance')
    throw new Error('Text must be enclosed in Text component');
  },
  appendInitialChild(parent, child) {
    parent.children.push(child);
  },
  finalizeInitialChildren() {
    //efi.SystemTable.ConOut.ClearScreen();
    //console.log('finalizeInitialChildren');
    return false;
  },
  shouldSetTextContent() {
    //console.log('shouldSetTextContent');
    return false;
  },
  getRootHostContext() {
    //console.log('getRootHostContext');
    return {};
  },
  getChildHostContext() {
    //console.log('getChildHostContext');
    return {};
  },
  getPublicInstance(i) {
    //console.log('getPublicInstance');
    return i;
  },
  prepareForCommit() {
    //console.log('prepareForCommit');
    return null;
  },
  resetAfterCommit() {
    //console.log('resetAfterCommit');
  },
  trackSchedulerEvent() {
    //console.log('trackSchedulerEvent')
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  supportsMicrotasks: true,
  scheduleMicrotask: (fn) => {
    //console.log('scheduleMicrotask');
    queueMicrotask(fn);
  },
  resolveEventTimeStamp() {
    //console.log('resolveEventTimeStamp');
    return performance.now();
  },
  resolveEventType() {
    //console.log('resolveEventType');
    return null;
  },
  preparePortalMount(containerInfo) {
    //console.log('containerInfo')
  },
  getInstanceFromNode(node) {
    //console.log('getInstanceFromNode')
    return null;
  },
  beforeActiveInstanceBlur() {
    //console.log('beforeActiveInstanceBlur')
  },
  afterActiveInstanceBlur() {
    //console.log('afterActiveInstanceBlur')
  },
  prepareScopeUpdate(_scopeInstance, _instance) {
    //console.log('prepareScopeUpdate')
  },
  getInstanceFromScope(_scopeInstance) {
    //console.log('getInstanceFromScope')
    throw Error('getInstanceFromScope - not implemented');
  },
  NotPendingTransition: undefined,
  HostTransitionContext: undefined,
  resetFormInstance(_form) {
    //console.log('resetFormInstance')
  },
  requestPostPaintCallback(_callback) {
    //console.log('requestPostPaintCallback')
  },
  shouldAttemptEagerTransition() {
    //console.log('shouldAttemptEagerTransition');
    return false;
  },
  maySuspendCommit(type, props) {
    //console.log('maySuspendCommit');
    return false;
  },
  preloadInstance(type, props) {
    //console.log('preloadInstance');
    return false;
  },
  suspendInstance(type, props) {
    //console.log('suspendInstance')
  },
  waitForCommitToBeReady() {
    //console.log('waitForCommitToBeReady')
    return null;
  },
  setCurrentUpdatePriority(newPriority) {},
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
    return {
      type,
      props: { ...oldProps, ...newProps },
      children: keepChildren ? instance.children : [],
    };
  },
  createContainerChildSet(container) {
    //console.log('createContainerChildSet');
    return [];
  },
  appendChildToContainerChildSet(childSet, child) {
    console.log('appendChildToContainerChildSet');
    childSet.push(child);
  },
  finalizeContainerChildren(container, newChildren) {
    // console.log('finalizeContainerChildren')
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
} satisfies BetterHostConfig<
  HostConfig<
    ElementTypes,
    BaseProps,
    { type: 'root'; children: Element[] },
    Element,
    never,
    never,
    never,
    unknown,
    unknown,
    unknown,
    Element[],
    unknown,
    unknown,
    unknown
  >
>;
const reconciler = ReactReconciler(hostConfig);

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
  },
  () => {},
);
reconciler.updateContainer(React.createElement(App), root, null, null);

let iters = 0;
try {
  while (__host.hasWork()) {
    __host.tick();
  }
} catch (e) {
  console.log('error on iteration: ' + iters);
  console.log(e);
}
console.log('done after ' + iters + ' iterations');
