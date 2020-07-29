export interface Feature {
  objectId: string;
  usn: number;
  auditId: string;
  zoneId: string;
  typeId: string;
  mod: string; // string containing number of milliseconds since UNIX epoch
  belongsTo: string;

  // the following are all tab-separated lists
  id: string;
  dataType: string;
  formId: string;
  fields: string;
  values: string;

  createdAt: string; // UTC date
  updatedAt: string; // UTC date
}
