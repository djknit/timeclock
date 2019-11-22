module.exports = () => ({
  rate: Number,
  overtime: {
    isOn: Boolean,
    rate: Number,
    cutoff: {
      type: Number,
      min: 0
    }
  }
})