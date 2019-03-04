import * as React from 'react';
import { cache } from './cache';

interface OwnProps {
  isLoading: boolean;
  id: string;
}
interface OwnState {
  width?: number;
  height?: number;
}

export default class PerfectPlaceholder extends React.Component<OwnProps, OwnState> {
  private placeholder: HTMLElement | null = null;
  private observer: HTMLElement | null = null;
  private lastDimensions: Dimensions;
  private timeout: number | null = null;

  constructor(props: Readonly<OwnProps>) {
    super(props);

    const key = this.getKey();
    const dimensions = cache.getDimensions(key);

    
    this.state = dimensions ? {
      width: dimensions.width,
      height: dimensions.height     
    } : {
      width: undefined,
      height: undefined,
    }
  }

  public render() {
    console.log('rendering', this.state)
    return (
      <div
        ref={this.setPlaceholderRef}
        style={{
          transition: 'width 200ms, height 200ms',
          width: `${this.state.width}px`,
          height: `${this.state.height}px`,
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

  public getSnapshotBeforeUpdate(prevProps: OwnProps) {
    if (!this.props.isLoading && prevProps.isLoading) {
      return this.getCurrentDimensions();
    }

    return null;
  }

  public componentDidUpdate(prevProps: OwnProps, _prevState: OwnState, snapshot: Dimensions) {
    console.log({ isLoading: this.props.isLoading })
    if (!this.props.isLoading && prevProps.isLoading) {
      const dimensions = this.getCurrentDimensions();
      dimensions && cache.saveDimensions(this.getKey(), dimensions);
      this.setState({
        width: snapshot.width,
        height: snapshot.height,
      }, () => {
        console.log('computed style', window.getComputedStyle(this.placeholder).width, window.getComputedStyle(this.placeholder).height);
        this.setState({
          width: dimensions.width,
          height: dimensions.height,
        }, () => {
          console.log('computed style', window.getComputedStyle(this.placeholder).width, window.getComputedStyle(this.placeholder).height);
        });
      });

      this.lastDimensions = this.getCurrentDimensions();
    

      // this.timeout = window.setTimeout(() => {
      //   this.setState({
      //     width: undefined,
      //     height: undefined,
      //   });
      // }, 1000);
    }
  }

  public componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
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
