import type { FC, BaseProps } from '@refi/uefi-react';
import type { KeyPressEvent } from '@refi/runtime';

import React, { useCallback, useEffect, useState } from 'react';
import { refiPointer } from '@refi/runtime';

const Thing: FC<{}> = ({ }) => {
  return (
    <box style={{ orientation: "row" }}>
      <text text="Testing non-intrinsics" />
    </box>
  );
};

const Counter: FC<{}> = ({ }) => {
  const [count, setCount] = useState(0);
  return (
    <box style={{ orientation: "row", gap: 4 }}>
      <box style={{ orientation: "row", border: 1, padding: 8 }}>
        <text text="-1" onClick={() => { setCount((count) => count - 1) }} />
      </box>
      <text text={`${count}`} />
      <box style={{ orientation: "row", border: 1, padding: 8 }}>
        <text text="+1" onClick={() => { setCount((count) => count + 1) }} />
      </box>
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
      onClick={(event) => { console.log(JSON.stringify(event)) }}
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

  return (
    <box style={{ gap: 8, orientation: "column", alignItems: "start", padding: 24, border: 2 }}>
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
        <text style={{ border: 1, bgColor: { r: 255, g: 0, b: 0, a: 255 } }} text="a" />
        <text style={{ border: 1, bgColor: { r: 255, g: 255, b: 255, a: 64 } }} text="row" />
        <box>
          <text text="^-^" />
        </box>
      </box>
      <text style={{ border: 1, margin: 8, padding: 16 }} text="I have margins borders and padding" />
      <box style={{ orientation: "row" }}>
        <text text="Unfocused input: " />
        <TextInput />
      </box>
      <box style={{ orientation: "row" }}>
        <text text="Focused input: " />
        <TextInput />
      </box>
      <Counter />
    </box >
  );
}
