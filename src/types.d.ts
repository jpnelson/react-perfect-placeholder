interface Dimensions {
  width: number;
  height: number;
}

interface CachedDimensions {
  dimensions: Dimensions;
  matching: {
    windowInnerWidth: number;
    windowInnerHeight: number;
  };
}
