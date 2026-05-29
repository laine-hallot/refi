import type { FC } from '@refi/uefi-react';

import React, { useEffect, useState } from 'react';
import { useGlobalKeyboard } from '@refi/uefi-react';
import { CharCodes, ScanCodes } from '@refi/runtime';

const Thing: FC<{}> = ({ }) => {
  return (
    <box orientation="row">
      <text text="Testing non-intrinsics 1" />
    </box>
  );
};

type r = ReturnType<typeof Thing>;

export function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const { unsubscribe } = useGlobalKeyboard(
      {
        key: {
          scanCode: ScanCodes.ScanUp,
          unicodeChar: CharCodes.CharNull,
        },
        keyState: { keyShiftState: 0, keyToggleState: 0 },
      },
      (keyData) => {
        setCount((c) => c + 1);
      },
    );
    const { unsubscribe: unsubscribeDown } = useGlobalKeyboard(
      {
        key: {
          scanCode: ScanCodes.ScanDown,
          unicodeChar: CharCodes.CharNull,
        },
        keyState: { keyShiftState: 0, keyToggleState: 0 },
      },
      (keyData) => {
        setCount((c) => c - 1);
      },
    );

    return () => {
      unsubscribe();
      unsubscribeDown();
    };
  }, []);
  useEffect(() => {
    //console.log('App - setting timeout')
    const id = setInterval(() => {
      //console.log('App - TIMEOUT COMPLETE');
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const [pointerState, setPointerState] = useState<any>({
    currentX: 0,
    currentY: 0,
    currentZ: 0,
    leftButton: false,
    rightButton: false,
  });

  return (
    <box orientation="column" separator={true} style={{ gap: 8 }}>
      <text style={{ border: 1 }} text={'tick ' + count} />
      <text
        style={{ border: 1, margin: 8, padding: 16 }}
        text="Hiiiiiiiiiiiii"
      />
      <Thing />
      {undefined}
      <text text={JSON.stringify(pointerState)} />
      <text
        style={{ border: 1 }}
        text="omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam."
      />
      <box separator={true} style={{ gap: 16 }}>
        <text text="testing" />
        <text text="hiiiiii" />
        <box>
          <text text="desu" />
        </box>
      </box>
    </box>
  );
}
