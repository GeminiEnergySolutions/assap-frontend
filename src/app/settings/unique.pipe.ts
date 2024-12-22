import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform<T, K extends keyof T>(value: T[], property: K): T[] {
    const uniqueValues = new Set();
    return value.filter(item => {
      if (!uniqueValues.has(item[property])) {
        uniqueValues.add(item[property]);
        return true;
      }
      return false;
    });
  }
}
