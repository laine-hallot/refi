import type ReactReconciler from 'react-reconciler';

type OriginalHostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  FormInstance,
  PublicInstance,
  HostContext,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  TransitionStatus,
> = ReactReconciler.HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  FormInstance,
  PublicInstance,
  HostContext,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  TransitionStatus
>;

type MutationMethods<
  T extends OriginalHostConfig<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> = { supportsMutation: true } & Pick<
  T,
  | 'supportsMutation'
  | 'appendChild'
  | 'appendChildToContainer'
  | 'insertBefore'
  | 'insertInContainerBefore'
  | 'removeChild'
  | 'removeChildFromContainer'
  | 'resetTextContent'
  | 'commitTextUpdate'
  | 'commitMount'
  | 'commitUpdate'
  | 'hideInstance'
  | 'hideTextInstance'
  | 'unhideInstance'
  | 'unhideTextInstance'
  | 'clearContainer'
>;

type PersistanceMethods<
  T extends OriginalHostConfig<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> = { supportsPersistence: true } & Pick<
  T,
  | 'supportsPersistence'
  | 'cloneInstance'
  | 'createContainerChildSet'
  | 'appendChildToContainerChildSet'
  | 'finalizeContainerChildren'
  | 'replaceContainerChildren'
  | 'cloneHiddenInstance'
  | 'cloneHiddenTextInstance'
>;

type HydrationMethods<
  T extends OriginalHostConfig<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> = { supportsHydration: true } & Pick<
  T,
  | 'supportsHydration'
  | 'canHydrateInstance'
  | 'canHydrateTextInstance'
  | 'canHydrateSuspenseInstance'
  | 'isSuspenseInstancePending'
  | 'isSuspenseInstanceFallback'
  | 'registerSuspenseInstanceRetry'
  | 'getNextHydratableSibling'
  | 'getFirstHydratableChild'
  | 'hydrateInstance'
  | 'hydrateTextInstance'
  | 'hydrateSuspenseInstance'
  | 'getNextHydratableInstanceAfterSuspenseInstance'
  | 'getParentSuspenseInstance'
  | 'commitHydratedContainer'
  | 'commitHydratedSuspenseInstance'
  | 'didNotMatchHydratedContainerTextInstance'
  | 'didNotMatchHydratedTextInstance'
  | 'didNotHydrateContainerInstance'
  | 'didNotHydrateInstance'
  | 'didNotFindHydratableContainerInstance'
  | 'didNotFindHydratableContainerTextInstance'
  | 'didNotFindHydratableContainerSuspenseInstance'
  | 'didNotFindHydratableInstance'
  | 'didNotFindHydratableTextInstance'
  | 'didNotFindHydratableSuspenseInstance'
  | 'errorHydratingContainer'
>;

type BaseMethods<
  T extends OriginalHostConfig<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> = Omit<
  T,
  | keyof PersistanceMethods<T>
  | keyof MutationMethods<T>
  | keyof HydrationMethods<T>
>;
export type BetterHostConfig<
  T extends OriginalHostConfig<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> = BaseMethods<T> &
  (Required<MutationMethods<T>> | { supportsMutation: false }) &
  (Required<PersistanceMethods<T>> | { supportsPersistence: false }) &
  (Required<HydrationMethods<T>> | { supportsHydration: false });

// declare module 'react-reconciler' {
//   namespace ReactReconciler {
//     type HostConfig<Type,
//       Props,
//       Container,
//       Instance,
//       TextInstance,
//       SuspenseInstance,
//       HydratableInstance,
//       FormInstance,
//       PublicInstance,
//       HostContext,
//       ChildSet,
//       TimeoutHandle,
//       NoTimeout,
//       TransitionStatus,
//     > = BetterHostConfig<OriginalHostConfig<Type,
//       Props,
//       Container,
//       Instance,
//       TextInstance,
//       SuspenseInstance,
//       HydratableInstance,
//       FormInstance,
//       PublicInstance,
//       HostContext,
//       ChildSet,
//       TimeoutHandle,
//       NoTimeout,
//       TransitionStatus
//     >>;
//   }
// }
