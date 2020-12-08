import { capitalizeFirstLetter } from '../../../utilities';

function getCompleteModalInfo({
  name, hasInputRef, ...otherInfo
}) {
  const capName = capitalizeFirstLetter(name);
  let completeInfo = {
    togglerName: `toggle${capName}Modal`,
    isActiveStatePropName: `is${capName}ModalActive`,
    ...otherInfo,
    name
  };
  if (hasInputRef) {
    completeInfo.inputRefName = `${name}InputRef`;
  }
  return completeInfo;
}

export { getCompleteModalInfo };
