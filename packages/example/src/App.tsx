import type { FC, BaseProps, KeyPressEvent } from '@refi/uefi-react';

import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalKeyboard, } from '@refi/uefi-react';
import { CharCodes, ScanCodes, refiPointer } from '@refi/runtime';

const Thing: FC<{}> = ({ }) => {
  return (
    <box orientation="row">
      <text text="Testing non-intrinsics 1" />
    </box>
  );
};

const TextInput: FC<BaseProps & { defaultValue?: string }> = ({ defaultValue, style }) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? '');

  const handleKeyPress = useCallback((value: KeyPressEvent) => {
    if (value.code === 'Backspace') {
      setInputValue((oldValue) => {
        return oldValue.slice(0, oldValue.length - 1);
      });
    }
    else {
      setInputValue((oldValue) => {
        return oldValue + value.key;
      });
    }
  }, [setInputValue]);

  return (
    <input
      value={inputValue}
      onKeyPress={handleKeyPress}
      style={style}
    />
  );
}

export function App() {
  const [count, setCount] = useState(0);
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
    <box orientation="column" style={{ gap: 8 }}>
      <text
        text="Hiiiiiiiiiiiii"
      />
      <text
        style={{ border: 1 }}
        text="Welcome to refi"
      />
      <text style={{ border: 1 }} text={`You've been here for ${count} seconds`} />
      <Thing />
      {undefined}
      <box style={{ gap: 2, margin: 4 }}>
        <text text="Your cursor position:" />
        <text text={JSON.stringify(refiPointer)} />
      </box>
      <box style={{ gap: 16 }}>
        <text style={{ border: 1 }} text="This" />
        <text style={{ border: 1 }} text="is" />
        <text style={{ border: 1 }} text="a" />
        <text style={{ border: 1 }} text="row" />
        <box>
          <text text="^-^" />
        </box>
      </box>
      <text style={{ border: 1, margin: 8, padding: 16 }} text="I have margins borders and padding" />
      <box orientation='row'>
        <text text="Unfocused input: " />
        <TextInput />
      </box>
      <box orientation='row'>
        <text text="Focused input: " />
        <TextInput />
      </box>
    </box>
  );
}
