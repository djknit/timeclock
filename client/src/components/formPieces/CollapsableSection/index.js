import React from 'react';
import { getClickableElAttrs } from '../../utilities';
import getStyle from './style';
import SectionLabel from '../SectionLabel';
import { addPseudoPseudoClasses } from '../../higherOrder';

function _CollapsableSection_needsPseudo({
  children,
  outsideContent,
  label,
  pseudoState, // for section content toggle arrow
  pseudoHandlers,
  contentToggle,
  disabled
}) {

  const style = getStyle(contentToggle.styles, pseudoState);

  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      {outsideContent}
      <div style={style.sectionContent} ref={contentToggle.containerRef}>
        {children}
      </div>
      <div style={style.sectionFooter}>
        <hr style={style.footerHr} />
        <i
          className="fas fa-chevron-up"
          style={style.sectionToggle}
          {...pseudoHandlers}
          {...getClickableElAttrs(contentToggle.toggle, disabled)}
        />
      </div>
    </>
  );
}

const CollapsableSection = addPseudoPseudoClasses(_CollapsableSection_needsPseudo);

export default CollapsableSection;