import { containerRefName } from './formState';
export * from './account';
export * from './currency';
export * from './time';
export * from './methodFactories';
export * from './methodBinders';

export { extractFormContainerRef };


function extractFormContainerRef(formMgmtComp) {
  return formMgmtComp[containerRefName];
}
