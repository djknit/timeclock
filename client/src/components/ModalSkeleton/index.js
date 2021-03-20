import React from 'react';
import getStyle from './style';

function ModalSkeleton({
  title,
  isActive,
  closeModal,
  children,
  footerContent,
  isCloseButtonDisabled,
  topBodyContent,
  bottomBodyContent,
  bodyStyles = {},
  bodyRef
}) {

  const hasExtraSection = topBodyContent || bottomBodyContent;
  const bodySections = hasExtraSection && (
    [['top', topBodyContent], ['main', children], ['bottom', bottomBodyContent]]
    .filter(orderedPair => !!orderedPair[1])
    .map(pair => ({ key: pair[0], content: pair[1] }))
  );
  
  const style = getStyle(hasExtraSection);

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
          />
        </header>
        <main className="modal-card-body" style={style.body} ref={bodyRef}>
          {bodySections ? (
            bodySections.map(({ key, content }, index) => (
              <section
                {...{ key }}
                style={{
                  ...(index > 0 ? style.sectionNotFirst : style.firstSection),
                  ...bodyStyles[key]
                }}
                children={content}
              />
            ))
          ) : (
            children
          )}
        </main>
        <footer className="modal-card-foot" style={style.footer}>
          {footerContent}
        </footer>
      </div>
    </div>
  );
}

export default ModalSkeleton;
