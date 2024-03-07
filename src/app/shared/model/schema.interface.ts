export interface SchemaResponse {
  message: string;
  data: SchemaSection[];
}

export interface SchemaSection {
  id: number;
  name: string;
  schema: SchemaElement[];
  copy?: CopySpec;
}

export interface CopySpec {
  buttonLabel: string;
  sourceSection: string;
  mapping: Record<string, string>;
}

export interface SchemaElement {
  key: string;
  hint: 'rq' | string;
  type: 'textBox' | 'select' | 'checkbox' | 'textArea' | 'date';
  title: string;
  /** for type=select, this is a comma-separated string of colon-separated key value pairs */
  values: string;
  dataType: 'text' | 'number' | 'date';
  isDateNow?: boolean;
  inputList?: SchemaSubElement[];
  isHeading?: boolean;
  heading?: string;
}

export interface SchemaSubElement extends SchemaElement {
  dependentKeyValue: string | number;
}
