import {ParseObject} from '../../parse/parse-object.interface';

export interface Feature extends ParseObject {
  usn: number;
  auditId: string;
  zoneId: string;
  typeId: string;
  mod: string; // string containing number of milliseconds since UNIX epoch
  belongsTo: string;

  // the following are all tab-separated lists
  id?: string;
  dataType?: string;
  fields?: string;
  formId: string;
  values: string;
}

export type CreateFeatureDto = Omit<Feature, Exclude<keyof ParseObject, 'ACL'>>;

export type FeatureData = Record<string, string>;
