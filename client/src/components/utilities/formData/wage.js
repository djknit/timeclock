import cc from 'currency-codes';
import { currencyValueStoreFactory } from './currency';

function wageValueStoreFactory() {
  let rateValueStore = currencyValueStoreFactory();
  let overTimeRateValueStore = currencyValueStoreFactory();
  
  let _value = {
    get rate() {
      return rateValueStore.getValue();
    },
    set rate(newRawValue) {
      const decimalDigits = this.currency ? cc.code(this.currency).digits : null;
      rateValueStore.setValue(newRawValue, decimalDigits);
    },
    currency: 'USD',
    useOvertime: true,
    overtime: {
      useMultiplier: true,
      multipier: 1.5,
      get rate() {
        return overTimeRateValueStore.getValue();
      },
      set rate(newRawValue) {
        const decimalDigits = 
      },
      cutoff: 40
    }
  };
}

export { wageValueStoreFactory };