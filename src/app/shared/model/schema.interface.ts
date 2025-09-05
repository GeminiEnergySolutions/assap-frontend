export interface SchemaSection {
  id: number;
  typeId?: number;
  name: string;
  order?: number;
  summary?: string;
  docs?: string;
  schema: SchemaElement[];
  copySchema?: CopySpec[];
  conditionalSchema?: ConditionalSchema;

  _dirty?: boolean;
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
  dataType: 'text' | 'number' | 'integer' | 'date' | 'bool';
  type: 'textBox' | 'select' | 'checkbox' | 'textArea' | 'date' | 'radio';
  title: string;
  hint: 'rq' | string;

  // Type-specific properties
  /**
   * An array of options for type=select.
   * In older schemas, this is a comma-separated string of colon-separated key value pairs.
   * @see FormChoicesPipe
   */
  values?: string | SchemaValue[];
  /**
   * For type=date, default is today.
   */
  isDateNow?: boolean;

  // Display properties
  isHeading?: boolean;
  heading?: string;
  required?: boolean;
  disabled?: boolean;
  unit?: string;
  defaultValue?: SchemaValue;
  gridSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  summary?: string;
  docs?: string;

  // Advanced properties
  validations?: SchemaRequirement[];
  inputList?: SchemaSubElement[];
}

export type SchemaValue = string | number | boolean | Date;

export type RequirementFunction = (data: Record<string, unknown>) => boolean | Promise<boolean>;

export interface SchemaRequirement {
  level?: 'warning' | 'error';
  if: string | RequirementFunction;
  message: string;
}

export interface SchemaSubElement extends SchemaElement {
  dependentKeyValue: SchemaValue | SchemaValue[];
}

export namespace SchemaSubElement {
  export function matchesDependentKeyValue(subElement: SchemaSubElement, keyValue: SchemaValue | undefined) {
    return Array.isArray(subElement.dependentKeyValue) ? keyValue && subElement.dependentKeyValue.includes(keyValue) : subElement.dependentKeyValue === keyValue;
  }
}
