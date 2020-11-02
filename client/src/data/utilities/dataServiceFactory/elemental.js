export { checkIsWaitingForSiblingResponse };

function checkIsWaitingForSiblingResponse(siblingListeners) {
  if (!siblingListeners) return false;
  let isWaitingForSiblingResponse = false;
  siblingListeners.forEach(listener => {
    if (listener.checkIsWaiting()) {
      isWaitingForSiblingResponse = true;
    }
  });
  return isWaitingForSiblingResponse;
}