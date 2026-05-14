import React, { useEffect, useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    //console.log('App - setting timeout')
    const id = setTimeout(() => {
      //console.log('App - TIMEOUT COMPLETE');
      setCount((c) => c + 1);
    }, 1000);
    return () => clearTimeout(id);
  });
  return (
    <box orientation="column" separator={true}>
      <text text={'tick ' + count} />
      <text text="Hiiiiiiiiiiiii" />
      <text text="omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam." />
      <box separator={true}>
        <text text="testing" />
        <text text="hiiiiii" />
      </box>
    </box>
  );
}
