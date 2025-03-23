import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
 name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T extends object>(value: T[], search: string, fields?: (keyof T)[]): T[] {
    if (!search) {
      return value;
    }
    const lowerSearch = search.toLowerCase();
    const filter = fields ?
      (item: T) => fields.some((field) => item[field]?.toString()?.toLowerCase()?.includes(lowerSearch)) :
      (item: T) => Object.values(item).some(value => value?.toString()?.toLowerCase()?.includes(lowerSearch));
    return value.filter(filter);
  }
}
