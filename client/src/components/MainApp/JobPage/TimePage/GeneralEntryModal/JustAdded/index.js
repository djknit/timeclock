import React, { Component } from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../utilities';
import ModalSectionTitle from '../ModalSectionTitle';
import Segment from './Segment';
import { addCollapsing, addPseudoPseudoClasses } from '../../../../../higherOrder';

class _JustAdded_needsCollapsingAndPseudo extends Component {
  componentDidMount() {
    this.props.sectionToggle.setHeight();
  };

  componentDidUpdate(prevProps) {
    const { windowWidth, sectionToggle, justAdded } = this.props;
    if (
      windowWidth !== prevProps.windowWidth ||
      (justAdded && justAdded.length) !== (prevProps.justAdded && prevProps.justAdded.length)
    ) {
      sectionToggle.setHeight();
    }
  };

  render() {
    const {
      justAdded,
      toggleDeleteSegmentModal,
      toggleEditSegmentModal,
      disabled,
      sectionToggle,
      pseudoState,
      pseudoHandlers,
      applySegmentUpdateToJustAdded
    } = this.props;

    if (!justAdded || justAdded.length === 0) {
      return <></>;
    }

    const style = getStyle(sectionToggle.styles, pseudoState);

    return (
      <>
        <div ref={sectionToggle.containerRef} style={style.container} >
          <ModalSectionTitle style={style.sectionTitle}>
            Just Added
          </ModalSectionTitle>
          {justAdded.map(segment => (
            <Segment
              {...{
                segment,
                toggleDeleteSegmentModal,
                disabled,
                toggleEditSegmentModal,
                applySegmentUpdateToJustAdded
              }}
              disabled={disabled || !sectionToggle.isExpanded}
              key={segment._id}
            />
          ))}
        </div>
        <div
          style={style.togglerDiv}
          {...pseudoHandlers}
          {...getClickableElAttrs(sectionToggle.toggle, disabled)}
        >
          <p style={style.togglerP}>
            <span style={style.toggleOpenText}>Show Just Added </span>
            <span style={style.toggleClosedText}>Hide Just Added </span>
          </p>
          <i className="fas fa-chevron-up" style={style.togglerArrow} />
        </div>
      </>
    );
  };
}

const _JustAdded_needsPseudo = addCollapsing(_JustAdded_needsCollapsingAndPseudo, 'sectionToggle', true, true);
const JustAdded = addPseudoPseudoClasses(_JustAdded_needsPseudo);

export default JustAdded;
