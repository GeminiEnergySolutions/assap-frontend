import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(value: any, property: string): any {
    const uniqueValues = new Set();
    return value.filter((item: any) => {
      if (!uniqueValues.has(item[property])) {
        uniqueValues.add(item[property]);
        return true;
      }
      return false;
    });
  }
}
