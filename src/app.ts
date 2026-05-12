import './host-shim.js'
//import './smoke.js'

import React from 'react'
import ReactReconciler from 'react-reconciler'
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';

type BaseProps = {};
type BoxElement = { type: 'box', props: BaseProps, children: Element[] };
type TextElement = { type: 'styled-text', props: BaseProps, children: Element[] };
type TextLiteral = { type: 'text', text: string };
type Element = BoxElement | TextElement | TextLiteral;
type ElementTypes = Element['type'];

const reconciler = ReactReconciler<
  ElementTypes,
  BaseProps,
  { type: 'root', children: Element[] },
  Element,
  Extract<Element, { type: 'text' }>,
  never,
  never,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>({
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  getCurrentUpdatePriority() {
    //console.log('getCurrentUpdatePriority');
    return DefaultEventPriority;
  },
  setCurrentUpdatePriority() {
    //console.log('setCurrentUpdatePriority');
  },
  // getSuspendedCommitReason() {
  //   console.log('startSuspendingCommit')
  // },
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
        return { type, props, text: "" };
      case 'box':
      default:
        return { type, props, children: [] };
    }
  },
  createTextInstance(text) {
    //console.log('createTextInstance')
    return { type: 'text', props: {}, text };
  },
  commitTextUpdate(textInstnce, oldText, newText) {
    //console.log('commitTextUpdate')
    textInstnce.text = newText;
  },
  appendInitialChild(parent, child) {
    //console.log('appendInitialChild');
    if (parent.type === 'text') {
      if (typeof child === 'string' || typeof child === 'boolean' || typeof child === 'number') {
        parent.text = child;
      } else {
        throw Error('<text/> Can not take children');
      }
    } else {
      parent.children.push(child);
    }
  },
  appendChild(parent, child) {
    //console.log('appendChild')
    if (parent.type === 'text') {
      if (typeof child === 'string' || typeof child === 'boolean' || typeof child === 'number') {
        parent.text = String(child);
      } else {
        throw Error('appendChild - <text/> Can not take children');
      }
    } else {
      parent.children.push(child);
    }
  },
  appendChildToContainer(container, child) {
    //console.log('appendChildToContainer')
    container.children.push(child);
  },
  removeChild(parent, child) {
    //console.log('removeChild')
    if (parent.type === 'text') {
      parent.text = '';
    } else {
      const i = parent.children.indexOf(child);
      if (i >= 0) parent.children.splice(i, 1);
    }
  },
  removeChildFromContainer(container, child) {
    //console.log('removeChildFromContainer')
    const i = container.children.indexOf(child);
    if (i >= 0) container.children.splice(i, 1);
  },
  insertBefore(parent, child, before) {
    //console.log('insertBefore');
    if (parent.type === 'text') {
      throw Error('<text/> Can not take children');
    }
    const i = parent.children.indexOf(before);
    parent.children.splice(i, 0, child);
  },
  insertInContainerBefore(c, child, before) {
    //console.log('insertInContainerBefore');
    const i = c.children.indexOf(before);
    c.children.splice(i, 0, child);
  },
  commitUpdate(instance, _payload, type, prev, next) {
    //console.log('commitUpdate', type)
    if (instance.type !== 'text') {
      instance.props = next;
    }
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
  clearContainer(c) {
    //efi.SystemTable.ConOut.ClearScreen();
    //console.log('clearContainer');
    c.children = [];
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
    throw Error('getInstanceFromScope - not implemented')
  },
  NotPendingTransition: undefined,
  HostTransitionContext: undefined,
  resetFormInstance: function (_form: unknown): void {
    //console.log('resetFormInstance')
  },
  requestPostPaintCallback(_callback) {
    //console.log('requestPostPaintCallback')
  },
  shouldAttemptEagerTransition() {
    //console.log('shouldAttemptEagerTransition');
    return false
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
    return null
  }
});

function App() {
  console.log('App')
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    console.log('App - setting timeout')
    const id = setTimeout(() => {
      console.log('App - TIMEOUT COMPLETE');
      setCount(c => c + 1)
    }, 1000)
    return () => clearTimeout(id)
  })
  return React.createElement('box', null, React.createElement('styled-text', null, 'tick ' + count))
}

const container = { type: 'root' as const, children: [] }
const root = reconciler.createContainer(container, 0, null, false, null, '', (e) => {
  console.error(e)
}, null, (error) => {
  console.error(error);
}, () => { })
reconciler.updateContainer(React.createElement(App), root, null, null)

let iters = 0
try {
  while (__host.hasWork()) {
    __host.tick()
  }
} catch (e) {
  console.log('error on iteration: ' + iters)
  console.log(e);
}
console.log('done after ' + iters + ' iterations')
