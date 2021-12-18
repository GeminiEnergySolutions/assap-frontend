import {ParseObject} from '../../parse/parse-object.interface';

export interface Feature extends ParseObject {
  usn: number;
  auditId: string;
  zoneId: string | null;
  typeId: string | null;
  mod: string; // string containing number of milliseconds since UNIX epoch
  belongsTo: 'preaudit' | 'type';

  // the following are all tab-separated lists
  dataType?: string;
  fields?: string;
  formId: string;
  values: string;
}

export type CreateFeatureDto = Omit<Feature, Exclude<keyof ParseObject, 'ACL'>>;

export type FeatureData = Record<string, string>;
