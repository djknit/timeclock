export * from '../../../../../utilities';

function getListSeparator(index, listLength) { // for separator following current element
  if (index < listLength - 2) return ', ';
  else if (index === 0 && listLength === 2) return ' and ';
  else if (index === listLength - 2) return ', and ';
  else return '';
}

export {
  getListSeparator
};
