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
        {extraPrecedingSectionContent && (
          <ModalCardBody style={style.precedingBody}>
            {extraPrecedingSectionContent}
          </ModalCardBody>
        )}
        <ModalCardBody {...{ children }} />
        {extraFollowingSectionContent && (
          <ModalCardBody style={style.followingBody}>
            {extraFollowingSectionContent}
          </ModalCardBody>
        )}
        <footer className="modal-card-foot" style={style.footer}>
          {footerContent}
        </footer>
      </div>
    </div>
  );
}

function ModalCardBody({ children, style: styleProp }) {
  const style = getStyle();
  return (
    <section
      className="modal-card-body"
      style={{ ...style.body, ...styleProp }}
    >
      {children}
    </section>
  );
}

export default ModalSkeleton;
