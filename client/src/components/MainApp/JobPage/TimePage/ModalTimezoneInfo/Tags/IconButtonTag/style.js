export default function getStyle(styleProp, isTagGroupEngaged) {

  return {
    tag: {
      ...styleProp
    },
    button: {
      // fontSize: isTagGroupEngaged ? '0. em' : undefined
    }
  };
};
