export interface Audit {
  objectId: string;
  auditId: string;
  name: string;
  usn: number; // user?
  mod: string; // string containing number of milliseconds since UNIX epoch
  zone: { [id: string]: Zone };
  type: { [id: string]: Type };
  createdAt: string; // UTC date
  updatedAt: string; // UTC date
}

export interface Zone {
  usn: number;
  name: string;
  typeId: number[];
  mod: number; // number of milliseconds since UNIX epoch
  id: number;
}

export interface Type {
  usn: number;
  name: string;
  type: string;
  subtype: string;
  mod: number; // number of milliseconds since UNIX epoch
  id: number;
  zoneId: number;
}
