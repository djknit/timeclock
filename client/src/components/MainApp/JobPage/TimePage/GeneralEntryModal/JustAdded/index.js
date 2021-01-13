import React, { Component } from 'react';
import getStyle from './style';
import ModalSectionTitle from '../ModalSectionTitle';
import Segment from './Segment';
import { addCollapsing } from '../../../../../higherOrder';

class _JustAdded_needsCollapsing extends Component {
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
      disabled,
      sectionToggle
    } = this.props;

    console.log(justAdded)

    if (!justAdded || justAdded.length === 0) {
      return <></>;
    }

    const style = getStyle(sectionToggle.styles);

    return (
      <>
        <div ref={sectionToggle.containerRef} style={style.container} >
          <ModalSectionTitle>
            Just Added
          </ModalSectionTitle>
          {justAdded.map(segment => (
            <Segment
              {...{
                segment,
                toggleDeleteSegmentModal,
                disabled
              }}
              key={segment._id}
            />
          ))}
        </div>
        <span>toggler goes here...</span>
      </>
    );
  };
}

const JustAdded = addCollapsing(_JustAdded_needsCollapsing, 'sectionToggle', true, true);

export default JustAdded;
