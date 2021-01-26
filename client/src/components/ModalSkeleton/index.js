import React from 'react';
import getStyle from './style';

function ModalSkeleton({
  title,
  isActive,
  closeModal,
  children,
  footerContent,
  isCloseButtonDisabled,
  extraPrecedingBodyContent,
  extraFollowingBodyContent,
  sectionStyles: { body, precedingBody, followingBody, footer } = {} // for auto complete
}) {

  const style = getStyle({ body, precedingBody, followingBody, footer });

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
        {extraPrecedingBodyContent && (
          <ModalCardBody style={style.precedingBody}>
            {extraPrecedingBodyContent}
          </ModalCardBody>
        )}
        <ModalCardBody {...{ children }} />
        {extraFollowingBodyContent && (
          <ModalCardBody style={style.followingBody}>
            {extraFollowingBodyContent}
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
