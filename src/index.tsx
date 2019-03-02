import * as React from 'react';
import { cache } from './cache';

export default class PerfectPlaceholder extends React.Component<OwnProps> {
  private placeholder: HTMLElement | null = null;
  private observer: HTMLElement | null = null;
  private timeout: number | null = null;

  public render() {
    const key = this.getKey();
    const dimensions = cache.getDimensions(key);

    return (
      <div
        ref={this.setPlaceholderRef}
        style={{
          border: '1px solid blue',
        }}
      >
        <div
          ref={this.setObserverRef}
          style={{
            padding: '0.05px' // to prevent collapsing margin
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

  public componentDidUpdate() {
    console.log({ isLoading: this.props.isLoading })
    if (!this.props.isLoading) {
      const dimensions = this.getCurrentDimensions();
      dimensions && cache.saveDimensions(this.getKey(), dimensions);

      // if (this.placeholder) {
      //   this.placeholder.style.width = `${styles.width}px`;
      //   this.placeholder.style.height = `${styles.height}px`;

      //   this.timeout = window.setTimeout(() => {
      //     if (this.placeholder) {
      //       this.placeholder.setAttribute('style', '');
      //     }
      //   }, 1000);
      // }
    }
  }

  public componentWillUnmount() {
    // if (this.timeout) {
    //   window.clearTimeout(this.timeout);
    // }
  }

  private setObserverRef = (ref: HTMLElement) => {
    this.observer = ref;
  }

  private setPlaceholderRef = (ref: HTMLElement) => {
    this.placeholder = ref;
  }

  private getKey = (): string => {
    return `_rpp:${this.props.id}`;
  }

  private getCurrentDimensions = (): Dimensions | null => {
    if (!this.observer) {
      return null;
    }

    const { width, height } = this.observer.getBoundingClientRect();
    return {
      width,
      height,
    }
  }
}
