import React, { Component } from 'react';

function addHeightTracking(ComponentToWrap) {

  return class Wrapper extends Component {
    constructor(props) {
      super(props);
      const numElsToTrack = props.n || 2;
      this.state = {};
      for (let i = 1; i <= numElsToTrack; i++) {
        this[`ref${i}`] = React.createRef();
        this.state[`height${i}`] = undefined;
      }
      // this.ref1 = React.createRef();
      // this.ref2 = React.createRef();
      // this.state = {
      //   height1: undefined,
      //   height2: undefined
      // };
    };

    componentDidMount() {
      this.setState({
        height1: this.ref1.current.clientHeight,
        height2: this.ref2.current.clientHeight
      });
    };

    componentDidUpdate() {
      const height1 = this.ref1.current.clientHeight;
      const height2 = this.ref2.current.clientHeight;
      if (this.state.height1 !== height1 || this.state.height2 !== height2) {
        this.setState({ height1, height2 });
      }
    };

    render() {
      const { props, state, ref1, ref2 } = this;
      const { firstColumnWidth, windowWidth, ...additionalProps } = props;
      const { height1, height2 } = state;
      const maxHeight = (
        (height1 && height2) ?
        (height1 > height2 ? height1 : height2) :
        (height1 || height2)
      );

      return (
        <ComponentToWrap
          {...additionalProps}
          heightTracking={{ ref1, ref2, height1, height2, maxHeight }}
        />
      );
    };
  };

}

export default addHeightTracking;