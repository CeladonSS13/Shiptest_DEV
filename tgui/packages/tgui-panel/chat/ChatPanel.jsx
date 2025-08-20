/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { Component, createRef } from 'react';
import { Button } from 'tgui-core/components';
import { shallowDiffers } from 'tgui-core/react';

import { chatRenderer } from './renderer';

export class ChatPanel extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = {
      scrollTracking: true,
    };
    this.handleScrollTrackingChange = (value) =>
      this.setState({
        scrollTracking: value,
      });
  }

  componentDidMount() {
    chatRenderer.mount(this.ref.current);
    chatRenderer.events.on(
      'scrollTrackingChanged',
      this.handleScrollTrackingChange,
    );
    this.componentDidUpdate();
  }

  componentWillUnmount() {
    chatRenderer.events.off(
      'scrollTrackingChanged',
      this.handleScrollTrackingChange,
    );
  }

  componentDidUpdate(prevProps) {
    requestAnimationFrame(() => {
      chatRenderer.ensureScrollTracking();
    });
    const shouldUpdateStyle =
      !prevProps || shallowDiffers(this.props, prevProps);
    if (shouldUpdateStyle) {
      const uiScale = this.props.uiScale || 1;
      chatRenderer.assignStyle({
        width: '100%',
        'white-space': 'pre-wrap',
        'font-size': `clamp(${Math.max(8, this.props.fontSize * 0.8)}px, ${this.props.fontSize}px, ${Math.min(32, this.props.fontSize * 1.2)}px)`,
        'line-height': this.props.lineHeight,
        '--ui-scale': uiScale,
      });
    }
  }

  render() {
    const { scrollTracking } = this.state;
    return (
      <>
        <div className="Chat" ref={this.ref} />
        {!scrollTracking && (
          <Button
            className="Chat__scrollButton"
            icon="arrow-down"
            onClick={() => chatRenderer.scrollToBottom()}
          >
            Scroll to bottom
          </Button>
        )}
      </>
    );
  }
}
