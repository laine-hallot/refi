import { ConEx, EfiKeyData } from '../../../../external/promethee/types';

const CON_EX = efi.SystemTable.BootServices.LocateProtocol(
  efi.guid.ConEx,
) as ConEx | null;

export const useGlobalKeyboard = (
  options: EfiKeyData,
  onKeyPress: (keyData: EfiKeyData) => void,
): { unsubscribe: () => void } => {
  if (CON_EX === null) {
    console.error('Could not locate EFI_SIMPLE_TEXT_INPUT_EX_PROTOCOL');
    return;
  }
  const handle = CON_EX.RegisterKeyNotify(options, onKeyPress);
  return { unsubscribe: () => CON_EX.UnregisterKeyNotify(handle) };
};
