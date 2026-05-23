type DimensionProps = {
  width?: number;
  height?: number;
  margin?: number;
  border?: number;
  padding?: number;
};

export type Dimensions = {
  width: number;
  height: number;
  margin: number;
  border: number;
  padding: number;
  readonly totalWidth: number;
  readonly totalHeight: number;
};

export const createDimensions = (
  dimensionProps?: DimensionProps,
): Dimensions => {
  return {
    width: dimensionProps?.width ?? 0,
    height: dimensionProps?.height ?? 0,
    margin: dimensionProps?.margin ?? 0,
    border: dimensionProps?.border ?? 0,
    padding: dimensionProps?.padding ?? 0,
    get totalWidth(): number {
      return this.width + this.margin * 2 + this.border * 2 + this.padding * 2;
    },
    get totalHeight(): number {
      return this.height + this.margin * 2 + this.border * 2 + this.padding * 2;
    },
  };
};
