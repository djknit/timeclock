import React, { Component } from 'react';
import ModalSkeleton from '../../ModalSkeleton';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  };

  render() {
    const { isActive, closeModal } = this.props;

    return (
      <ModalSkeleton
        isActive={isActive}
        closeModal={closeModal}
      >
        <div>TEST</div>
      </ModalSkeleton>
    );
  };
}

export default LoginModal;