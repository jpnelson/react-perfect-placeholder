import * as React from 'react';

interface OwnProps {
  isLoading: boolean;
  id: string;
}

interface Dimensions {
  width: number;
  height: number;
}

export default class PerfectPlaceholder extends React.Component<OwnProps> {
  private wrapper: Element | null = null;

  public render() {
    const style = this.props.isLoading ? this.getDimensionsFromStorage() : {}
    return <div style={style} ref={this.setRef}>{this.props.children}</div>;
  }

  public componentDidUpdate() {
    if (!this.props.isLoading) {
      const dimensions = this.getDimensionsFromWrapper();
      dimensions && this.saveDimensionsToStorage(dimensions);
    }
  }

  private setRef = (ref: Element) => {
    this.wrapper = ref;
  }

  private getKey = (): string => {
    if (!this.wrapper) {
      return null;
    }

    return `_rpp:${this.props.id}:${window.innerWidth}x${window.innerHeight}`;
  }

  private saveDimensionsToStorage = (dimensions: Dimensions) => {
    if (!window.localStorage) {
      return;
    }

    const key = this.getKey();

    if (!key) {
      return;
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(dimensions),
    );
  }

  private getDimensionsFromWrapper = (): Dimensions | null => {
    if (!this.wrapper) {
      return null;
    }

    const { width, height } = this.wrapper.getBoundingClientRect();
    return {
      width,
      height,
    }
  }

  private getDimensionsFromStorage = (): Dimensions | null => {
    if (!window.localStorage) {
      return null;
    }

    const item = window.localStorage.getItem(this.getKey());
    if (!item) {
      return null;
    }

    return JSON.parse(item);
  }
}
