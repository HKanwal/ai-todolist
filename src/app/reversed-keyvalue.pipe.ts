import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reversedKeyvalue',
})
export class ReversedKeyvaluePipe implements PipeTransform {
  transform<V>(value: { [x: string]: V }): KeyValue<string, V>[] {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const reversedEntries = Object.entries<V>(value).reverse();
    return reversedEntries.map((entry) => {
      return {
        key: entry[0],
        value: entry[1],
      };
    });
  }
}
