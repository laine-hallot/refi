
const screen = getScreenSize();
const container: RootContainer = {
  type: 'root',
  props: {
    height: screen.verticalResolution,
    width: screen.horizontalResolution,
    bgColor: { r: 5, g: 6, b: 22, a: 255 },
  },
  children: [],
};

const root = reconciler.createContainer(
  container,
  0,
  null,
  false,
  null,
  '',
  (e) => {
    console.error(e);
  },
  null,
  (error) => {
    console.error(error);
    console.error(error.message);
  },
  () => { },
);

reconciler.updateContainer(React.createElement(App), root, null, null);
