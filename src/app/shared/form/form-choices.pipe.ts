import {Pipe, PipeTransform} from '@angular/core';
import {SchemaValue} from '../model/schema.interface';

@Pipe({
  name: 'formChoices',
  standalone: false,
})
export class FormChoicesPipe implements PipeTransform {
  transform(value: string | SchemaValue[]): SchemaValue[] {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.substring(v.indexOf(':') + 1));
    }
    return value;
  }
}
