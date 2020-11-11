module.exports = {
  areWagesEquivalent
};

function areWagesEquivalent(wage1, wage2) {
  if (!wage1 && !wage2) return true;
  if (!wage1 || !wage2) return false;
  return (
    wage1.rate === wage2.rate &&
    wage1.currency === wage2.currency &&
    wage1.overtime.rate === wage2.overtime.rate &&
    wage1.overtime.rateMultiplier === wage2.overtime.rateMultiplier &&
    wage1.overtime.useMultiplier === wage2.overtime.useMultiplier &&
    wage1.overtime.cutoff === wage2.overtime.cutoff
  );
}
