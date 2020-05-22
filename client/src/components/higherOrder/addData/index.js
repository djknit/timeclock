// ABOUT THIS FILE:
// The purpose of this higher order component is to reduce the amount of code needed for a component to read and subscribe to a data service. (See '[...]/src/data' to see what I mean by "data service".)
// This component will subscribe to the data service, store the current value in state, and pass the value as props to the wrapped component.
// The data wrapper is only responsible for reading, so the wrapped component must use the data service methods directly if it needs to modify the data from the service.

import React, { Component } from 'react';

function addData(ComponentToWrap, dataPropName, dataService) {
  return class WrappedComponent extends Component {
    constructor(props) {
      super(props);
      this.getDataValue = this.getDataValue.bind(this);
      this.state = { dataValue: dataService.getValue() };
    };

    getDataValue() {
      this.setState({ dataValue: dataService.getValue() });
    };

    componentDidMount() {
      dataService.subscribe(this.getDataValue);
    };

    componentWillUnmount() {
      dataService.unsub(this.getDataValue);
    };

    render() {
      return (
        <ComponentToWrap {...this.props} {...{ [dataPropName]: this.state.dataValue }} />
      );
    };
  };
};

export default addData;