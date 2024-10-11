export interface SchemaResponse {
  message: string;
  data: SchemaSection[];
}

export interface SchemaSection {
  id: number;
  name: string;
  schema: SchemaElement[];
  copySchema?: CopySpec[];
  conditionalSchema?: ConditionalSchema;
}

export interface ConditionalSchema {
  disabled?: DisabledSchema[];
}

export interface DisabledSchema {
  if: string;
  message: string;
}

export interface CopySpec {
  buttonLabel: string;
  /** key=target, value=source -- to make all targets unique, but allow the same targets to copy from the same source */
  mappingInputs: Record<string, string>;
}

export interface SchemaElement {
  // Required properties
  key: string;
  dataType: 'text' | 'number' | 'date' | 'bool';
  type: 'textBox' | 'select' | 'checkbox' | 'textArea' | 'date' | 'radio';
  title: string;
  hint: 'rq' | string;

  // Type-specific properties
  /**
   * An array of options for type=select.
   * In older schemas, this is a comma-separated string of colon-separated key value pairs.
   * @see FormChoicesPipe
   */
  values?: string | string[];
  /**
   * For type=date, default is today.
   */
  isDateNow?: boolean;

  // Display properties
  isHeading?: boolean;
  heading?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: SchemaValue;

  // Advanced properties
  validations?: SchemaRequirement[];
  inputList?: SchemaSubElement[];
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
