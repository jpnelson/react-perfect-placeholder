const MATCHING_MARGIN = 0.25; // % by which we will consider the dimensions a match good enough to try our intermediate styles

class Cache {
  public saveDimensions = (key: string, dimensions: Dimensions) => {
    if (!window.localStorage) {
      return;
    }

    if (!key) {
      return;
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(this.getCachedDimensions(dimensions))
    );
  };

  public getDimensions = (key: string): Dimensions | null => {
    if (!window.localStorage) {
      return null;
    }

    const item = window.localStorage.getItem(key);

    if (!item) {
      return null;
    }
    const placeholder = JSON.parse(item) as CachedDimensions;

    if (
      placeholder.matching.windowInnerHeight >
        window.innerHeight * (1 - MATCHING_MARGIN) &&
      placeholder.matching.windowInnerHeight <
        window.innerHeight * (1 + MATCHING_MARGIN) &&
      placeholder.matching.windowInnerWidth >
        window.innerWidth * (1 - MATCHING_MARGIN) &&
      placeholder.matching.windowInnerWidth <
        window.innerWidth * (1 + MATCHING_MARGIN)
    ) {
      return placeholder.dimensions;
    } else {
      return null;
    }
  };


  private getCachedDimensions = (dimensions: Dimensions): CachedDimensions => {
    return {
      dimensions,
      matching: {
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
      }
    }
  }
}

export const cache = new Cache();
