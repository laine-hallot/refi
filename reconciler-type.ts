import type ReactReconciler from "react-reconciler";


type OriginalHostConfig<Type,
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
  TransitionStatus> = ReactReconciler.HostConfig<
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
    TransitionStatus>;

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
  >
> = Pick<T,
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
  >
> = Pick<T,
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
  >
> = Pick<T,
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

type BaseMethods<T extends OriginalHostConfig<
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
>> = Omit<T,
  | keyof PersistanceMethods<T>
  | keyof MutationMethods<T>
  | keyof HydrationMethods<T>
  | 'supportsMutation'
  | 'supportsHydration'
>;

export type BetterHostConfig<T extends OriginalHostConfig<
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
>> =
  BaseMethods<T>
  & ({ supportsMutation: true, supportsPersistence: false, } & Required<MutationMethods<T>>) | ({ supportsMutation: false, supportsPersistence: true } & Required<PersistanceMethods<T>>)
  & ({ supportsHydration: true } & Required<HydrationMethods<T>>) | ({ supportsHydration: false });

declare module 'react-reconciler' {
  namespace ReactReconciler {
    type HostConfig<Type,
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
    > = BetterHostConfig<OriginalHostConfig<Type,
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
    >>;
  }
}
