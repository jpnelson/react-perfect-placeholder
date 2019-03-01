import * as React from 'react';

interface OwnProps {
  isLoading: boolean;
  id: string;
}

interface SavedStyle {
  width: number;
  height: number;
}

interface SavedPlaceholder {
  styles: SavedStyle
  matching: {
    windowInnerWidth: number;
    windowInnerHeight: number;
  }
}

const MATCHING_MARGIN = 0.25; //% by which we will consider the dimensions a match good enough to try our intermediate styles

export default class PerfectPlaceholder extends React.Component<OwnProps> {
  private wrapper: Element | null = null;

  public render() {
    const dimensions = this.getStylesFromStorage();

    const style = this.props.isLoading && dimensions ? {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
    } : undefined;
    return <div style={{ ...style, overflow: 'auto' }} ref={this.setRef}>{this.props.children}</div>;
  }

  public componentDidUpdate() {
    if (!this.props.isLoading) {
      const styles = this.getStylesFromWrapper();
      styles && this.saveStylesToStorage(styles);
    }
  }

  private setRef = (ref: Element) => {
    this.wrapper = ref;
  }

  private getKey = (): string => {
    return `_rpp:${this.props.id}`;
  }

  private saveStylesToStorage = (styles: SavedStyle) => {
    if (!window.localStorage) {
      return;
    }

    const key = this.getKey();

    if (!key) {
      return;
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(this.makePlaceholder(styles)),
    );
  }

  private makePlaceholder = (styles: SavedStyle): SavedPlaceholder => {
    return {
      styles,
      matching: {
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
      }
    }
  }

  private getStylesFromWrapper = (): SavedStyle | null => {
    if (!this.wrapper) {
      return null;
    }

    const { width, height } = this.wrapper.getBoundingClientRect();
    return {
      width,
      height,
    }
  }

  private getStylesFromStorage = (): SavedStyle | null => {
    if (!window.localStorage) {
      return null;
    }

    const item = window.localStorage.getItem(this.getKey());

    if (!item) {
      return null;
    }
    const placeholder = (JSON.parse(item) as SavedPlaceholder);

    if (
      placeholder.matching.windowInnerHeight > window.innerHeight * (1 - MATCHING_MARGIN) &&
      placeholder.matching.windowInnerHeight < window.innerHeight * (1 + MATCHING_MARGIN) &&
      placeholder.matching.windowInnerWidth > window.innerWidth * (1 - MATCHING_MARGIN) &&
      placeholder.matching.windowInnerWidth < window.innerWidth * (1 + MATCHING_MARGIN)
    ) {
      return placeholder.styles;
    } else {
      return null;
    }
  }
}
