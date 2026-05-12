import React from 'react';

export function App() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
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
      <box separator={true}>
        <text text="testing" />
        <text text="hiiiiii" />
      </box>
    </box>
  );
}
