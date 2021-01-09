import React from 'react';
import getStyle from './style';

function ModalSkeleton({
  title,
  isActive,
  closeModal,
  children,
  footerContent,
  isCloseButtonDisabled,
  extraPrecedingSectionContent,
  extraFollowingSectionContent
}) {

  const style = getStyle();

  const modalContainerClass = `modal${isActive ? ' is-active' : ''}`;

  return (
    <div className={modalContainerClass}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={closeModal}
            disabled={isCloseButtonDisabled}
          ></button>
        </header>
        {/* {extraPrecedingSectionContent && (
          <ModalCardBody children={extraPrecedingSectionContent} />
        )} */}
        <ModalCardBody {...{ children }} />
        {/* <section className="modal-card-body" style={style.body}>
          {children}
        </section> */}
        {/* {extraFollowingSectionContent && (
          <ModalCardBody children={extraFollowingSectionContent} />
        )} */}
        <footer className="modal-card-foot" style={style.footer}>
          {footerContent}
        </footer>
      </div>
    </div>
  );
}

function ModalCardBody({ children }) {
  const style = getStyle();
  return (
    <section className="modal-card-body" style={style.body}>
      {children}
    </section>
  );
}

export default ModalSkeleton;
