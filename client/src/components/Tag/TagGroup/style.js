export default function getStyle(
  align,
  isInline,
  groupMargin = 10,
  tagMargin = '0.2rem'
) {

  const processedMargin = typeof(groupMargin) === 'number' ? `${groupMargin}px` : groupMargin;

  let groupStyle = {
    marginBottom: tagMargin ? `calc(${processedMargin} - ${tagMargin})` : processedMargin
  };

  if (isInline) {
    groupStyle.display = 'inline-block';
    groupStyle.marginRight = groupStyle.marginLeft = '0.5em';
  }
  else if (align === 'center' || align === 'right') {
    groupStyle.justifyContent = (
      align === 'right' ? 'flex-end' : 'center'
    );
  }

  return {
    tagGroup: groupStyle,
    tag: {
      marginBottom: tagMargin
    }
  };
};