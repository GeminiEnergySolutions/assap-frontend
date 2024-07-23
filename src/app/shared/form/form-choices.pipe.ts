import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formChoices',
})
export class FormChoicesPipe implements PipeTransform {
  transform(value: string | string[]): string[] {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.substring(v.indexOf(':') + 1));
    }
    return value;
  }
}
