export type Position = {
  x: number;
  y: number;
  z: number;
};

export const createPosition = (
  parentPosition: Position,
  parentOrientation: 'row' | 'column',
): Position => {
  switch (parentOrientation) {
    case 'row':
      return { x: 0, y: 0, z: 0 };
    case 'column':
      return { x: 0, y: 0, z: 0 };
  }
};
