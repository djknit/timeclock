import React from 'react';
import getStyle from './style';

function ModalSkeleton({
  title,
  isActive,
  closeModal,
  children,
  footerContent
}) {

  const style = getStyle();

  const modalContainerClass = `modal${isActive ? ' is-active' : ''}`;

  return (
    <div className={modalContainerClass}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={closeModal}></button>
        </header>
        <section className="modal-card-body">
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