import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formInputType',
})
export class FormInputTypePipe implements PipeTransform {
  static readonly mapping: Record<string, string> = {
    emailrow: 'email',
    phonerow: 'tel',
    introw: 'number',
    decimalrow: 'number',
  };

  transform(value: string): string {
    return FormInputTypePipe.mapping[value] || 'text';
  }
}
