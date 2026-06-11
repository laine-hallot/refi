import type {
  Box,
  UefiElement,
  RootElement,
  Text,
  Input,
} from '@refi/layout-engine';

import ReactReconciler, { ReactContext } from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import { match } from 'match-discriminated-union';

import { render } from '@refi/layout-engine';
import { refiKeyDataToKeyEvent } from '@refi/runtime';

export type ElementTypes = UefiElement['type'];
export type ElementProps = UefiElement['props'] & { id: number };

const hostContext = {};
// @ts-expect-error -- Undocumented form API that I don't even think we need
const hostTransitionContext: ReactContext<any> = {};

type ToInstance<T> = T & { props: { id: number } };

type BoxIntance = ToInstance<Box>;
type TextIntance = ToInstance<Text>;
type InputIntance = ToInstance<Input>;

type RefiIntance = BoxIntance | TextIntance | InputIntance;

export const reconciler = ReactReconciler<
  ElementTypes,
  ElementProps,
  RootElement,
  RefiIntance,
  never,
  never,
  never,
  unknown,
  unknown,
  typeof hostContext,
  UefiElement[],
  unknown,
  unknown,
  typeof hostTransitionContext
>({
  supportsMutation: false,
  supportsPersistence: true,
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
    const id = refi.createId();
    if (props.onClick !== undefined) {
      refiInput.addClickListener({ id }, (event) => {
        props.onClick?.(event);
      });
    }
    switch (type) {
      case 'text':
        return {
          __id: id,
          type: 'text',
          props,
        } as TextIntance;
      case 'box':
        return {
          __id: id,
          type: 'box',
          props,
          children: [],
        } as BoxIntance;
      case 'input':
        refi.setFocused(id);
        if ('onKeyPress' in props) {
          refiInput.addKeyboardListener({ id }, (event) => {
            props.onKeyPress?.(refiKeyDataToKeyEvent(event));
          });
        }
        return {
          __id: id,
          type: 'input',
          props: {
            ...props,
            style: {
              padding: 4,
              bgColor: { r: 255, g: 255, b: 255, a: 255 },
              ...(props.style ?? {}),
            },
          },
        } as InputIntance;
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
    return match(instance, 'type', {
      text: (text) => {
        return {
          __id: instance.__id,
          type,
          props: { ...oldProps, ...newProps },
        };
      },
      box: (box) => {
        return {
          __id: instance.__id,
          type,
          props: { ...oldProps, ...newProps },
          children: keepChildren ? box.children : [],
        };
      },
      input: (input) => {
        return {
          __id: instance.__id,
          type,
          props: {
            ...input.props,
            ...oldProps,
            ...newProps,
            style: {
              ...input.props.style,
              ...oldProps.style,
              ...newProps.style,
            },
          },
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
