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

const MATCHING_MARGIN = 0.25; // % by which we will consider the dimensions a match good enough to try our intermediate styles

export default class PerfectPlaceholder extends React.Component<OwnProps> {
  private wrapper: HTMLElement | null = null;
  private timeout: number | null = null;

  public render() {
    const dimensions = this.getStylesFromStorage();

    const style = this.props.isLoading && dimensions ? {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      transition: 'width 200ms, height 200ms'
    } : undefined;
    return (
      <div
        style={{
          ...style,
          padding: '0.05px' // to prevent collapsing margin
        }}
        ref={this.setRef}
      >
        {this.props.children}
      </div>
    );
  }

  public componentDidUpdate() {
    if (!this.props.isLoading) {
      const styles = this.getStylesFromWrapper();
      styles && this.saveStylesToStorage(styles);

      if (this.wrapper) {
        this.wrapper.style.width = `${styles.width}px`;
        this.wrapper.style.height = `${styles.height}px`;

        this.timeout = window.setTimeout(() => {
          if (this.wrapper) {
            this.wrapper.setAttribute('style', '');
          }
        }, 1000);
      }
    }
  }

  public componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }

  private setRef = (ref: HTMLElement) => {
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
