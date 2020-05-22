import React from 'react';
import getStyle from './style';

function ModalSkeleton({
  title,
  isActive,
  closeModal,
  children,
  footerContent,
  isCloseButtonDisabled
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
        <section className="modal-card-body" style={style.body}>
          {children}
        </section>
        <footer className="modal-card-foot" style={style.footer}>
          {footerContent}
        </footer>
      </div>
    </div>
  );
}

export default ModalSkeleton;