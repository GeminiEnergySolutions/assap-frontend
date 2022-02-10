import {ParseObject} from '../parse/parse-object.interface';

export interface Schema extends ParseObject {
  type: string;
  subtype: string | null;
  geminiForm: Section[];
}

export type SchemaId = Pick<Schema, 'type' | 'subtype'>;

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
