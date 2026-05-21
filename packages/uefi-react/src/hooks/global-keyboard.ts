import { ConEx, EfiKeyData } from '@refi/runtime';

const CON_EX = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.ConEx,
) as ConEx | null;

export const useGlobalKeyboard = (
  options: EfiKeyData,
  onKeyPress: (keyData: EfiKeyData) => void,
): { unsubscribe: () => void } => {
  if (CON_EX === null) {
    throw new Error('Could not locate EFI_SIMPLE_TEXT_INPUT_EX_PROTOCOL');
  }
  const handle = CON_EX.RegisterKeyNotify(options, onKeyPress);
  return { unsubscribe: () => CON_EX.UnregisterKeyNotify(handle) };
};
