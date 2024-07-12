export interface SchemaResponse {
  message: string;
  data: SchemaSection[];
}

export interface SchemaSection {
  id: number;
  name: string;
  schema: SchemaElement[];
  copySchema?: CopySpec[];
}

export interface CopySpec {
  buttonLabel: string;
  /** key=target, value=source -- to make all targets unique, but allow the same targets to copy from the same source */
  mappingInputs: Record<string, string>;
}

export interface SchemaElement {
  key: string;
  hint: 'rq' | string;
  type: 'textBox' | 'select' | 'checkbox' | 'textArea' | 'date';
  title: string;
  /** for type=select, this is a comma-separated string of colon-separated key value pairs */
  values: string;
  dataType: 'text' | 'number' | 'date';
  validations?: SchemaRequirement[];
  isDateNow?: boolean;
  inputList?: SchemaSubElement[];
  isHeading?: boolean;
  heading?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: SchemaValue;
}

export type SchemaValue = string | number | boolean;

export interface SchemaRequirement {
  level?: 'warning' | 'error';
  type: 'min' | 'max' | 'pattern';
  value: SchemaValue;
  message: string;
}

export interface SchemaSubElement extends SchemaElement {
  dependentKeyValue: SchemaValue | SchemaValue[];
}
