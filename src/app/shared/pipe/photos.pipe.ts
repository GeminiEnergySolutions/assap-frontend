import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photos'
})
export class PhotosPipe implements PipeTransform {

  transform(value: any[], ...args: any): any {
    if (!value || !value.length) {
      return [];
    }
    return value;
  }

}
