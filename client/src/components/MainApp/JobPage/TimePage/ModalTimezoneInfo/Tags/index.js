import React from 'react';
import getStyle from './style';
import { getTimezoneAbbreviation, constants } from '../../utilities';
import { addPseudoPseudoClasses } from '../../../../../higherOrder';
import Tag, { TagGroup } from '../../../../../Tag';
import IconButtonTag from './IconButtonTag';

const editSessionTzIconClass = constants.iconClassNames.editSessionTimezone;

function _Tags_needsPseudo({
  sessionTimezone,
  toggleMessage,
  toggleSessionTimezoneModal,
  disabled,
  margin = '0.75em',
  pseudoState,
  pseudoHandlers
}) {

  const tzAbbreviation = getTimezoneAbbreviation(sessionTimezone);

  const commonBtnTagAttrs = {
    disabled,
    isTagGroupEngaged: pseudoState.isHovered || pseudoState.isFocused || pseudoState.isActive
  };
  
  const style = getStyle();

  return (
    <div
      className="field is-grouped is-grouped-multiline"
      style={style.field}
    >
      <div className="control" style={style.control}>
        <TagGroup
          tagMargin={0}
          groupMargin={margin}
          align="right"
          {...pseudoHandlers}
        >
          <Tag theme="info">
            Timezone: {tzAbbreviation}
          </Tag>
          <IconButtonTag
            theme="info"
            {...commonBtnTagAttrs}
            onClick={() => toggleMessage(true)}
          />
          <IconButtonTag
            theme="primary"
            iconClassName={editSessionTzIconClass}
            onClick={() => toggleSessionTimezoneModal(true)}
            {...commonBtnTagAttrs}
          />
        </TagGroup>
      </div>
    </div>
  );
}

const Tags = addPseudoPseudoClasses(_Tags_needsPseudo);

export default Tags;  
