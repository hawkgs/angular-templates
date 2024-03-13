import { Pipe, PipeTransform } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { Common as EnvCommonTypes } from '../../../environments/common';

type CurrencyType = typeof EnvCommonTypes.currency;

const CURRENCY_SYMBOL: { [key in CurrencyType]: string } = {
  ['usd']: '$',
  ['eur']: '€',
};

const round = (a: number) => Math.round(a * 100) / 100;

@Pipe({
  name: 'currency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(amount: number) {
    return `${CURRENCY_SYMBOL[env.currency]} ${round(amount)}`;
  }
}
