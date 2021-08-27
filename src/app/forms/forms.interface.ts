import {ParseObject} from '../parse/parse-object.interface';

export interface Schema extends Partial<ParseObject> {
  geminiForm: Section[];
}

export interface Section {
  index: number;
  section: string;
  elements: Element[];
  id: string;
}

export type DataType = 'pickerinputrow' | 'emailrow' | 'phonerow' | 'textrow' | 'textarearow' | 'introw' | 'decimalrow';
export type ValidationType = 'mandatory' | 'optional';

export interface Element {
  index: number;
  hint: string;
  dataType: DataType;
  defaultValues: string;
  param: string;
  validation: ValidationType;
  id: string;
}
