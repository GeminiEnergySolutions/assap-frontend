import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formChoices',
})
export class FormChoicesPipe implements PipeTransform {
  transform(value: string): [string, string][] {
    return value.split(',').map((v) => v.split(':', 2) as [string, string]);
  }
}
