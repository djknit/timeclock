export default function getStyle(
  hasAlign,
  isInline,
  groupMargin = 10,
  tagMargin = '0.2rem'
) {

  const processedMargin = typeof(groupMargin) === 'number' ? `${groupMargin}px` : groupMargin;

  let groupStyle = {
    marginBottom: `calc(${processedMargin} - ${tagMargin})` // .5rem come from Bulma .tag style
  };

  if (isInline) {
    groupStyle.display = 'inline-block';
    groupStyle.marginRight = groupStyle.marginLeft = '0.5em'
  }
  else if (hasAlign) {
    groupStyle.display = 'block';
  }

  return {
    tagGroup: groupStyle,
    tag: {
      marginBottom: tagMargin
    }
  };
};