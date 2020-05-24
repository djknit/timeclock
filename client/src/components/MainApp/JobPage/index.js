import React, { Component } from 'react';
import getStyle from './style';

class JobPage extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const style = getStyle();

    return (
      <div style={style.jobsArea}></div>
    );
  };
}

export default JobPage;