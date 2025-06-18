import {Pipe, PipeTransform} from '@angular/core';

const CURRENCY_SYMBOLS = new Set([
  '$', '€', '£', '¥', '₹', '₩', '₽', '₺', '₪', '₫', '₱', '₦', '₴', '₭',
  'EUR', 'USD', 'GBP', 'JPY', 'INR', 'KRW', 'RUB', 'TRY', 'ILS', 'VND', 'PHP', 'NGN', 'UAH', 'LAK',
]);

@Pipe({
  name: 'isCurrency',
})
export class IsCurrencyPipe implements PipeTransform {
  transform(value: string): boolean {
    return CURRENCY_SYMBOLS.has(value);
  }
}
