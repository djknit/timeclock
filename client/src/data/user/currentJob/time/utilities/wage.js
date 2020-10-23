function areWagesEquivalent(wage_1, wage_2) {
  // expect wages already processed for output, but NOT processed for earnings calc
  if (!wage_1 && !wage_2) return true;
  if (!wage_1 || !wage_2) return false;
  if (
    _hasDiff(w => w.currency) ||
    _hasDiff(w => w.rate.raw) ||
    _hasDiff(w => !!w.overtime)
  ) return false;
  if (!wage_1.overtime) return true;
  if (
    _hasDiff(w => w.overtime.cutoff.durationInMsec) ||
    _hasDiff(w => w.overtime.useMultiplier) ||
    _hasDiff(w => w.overtime.useMultiplier ? w.overtime.rateMultiplier : w.overtime.rate.raw)
  ) return false;
  return true;

  function _hasDiff(_evaluator) {
    return _evaluator(wage_1) !== _evaluator(wage_2);
  }
}

export { areWagesEquivalent };