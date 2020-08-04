export interface Audit {
  /** user-supplied name */
  name: string;
  /** contained Zones by ID */
  zone: { [id: string]: Zone };
  /** contained Types by ID */
  type: { [id: string]: Type };

  // metadata
  /** ID */
  auditId: string;
  /** ? */
  usn: number;
  /** modification time as string containing number of milliseconds since UNIX epoch */
  mod: string;

  // Parse metadata
  /** record ID */
  objectId: string;
  /** record creation date and time as ISO-8601 UTC timestamp */
  createdAt: string;
  /** record modification date and time as ISO-8601 UTC timestamp */
  updatedAt: string;
}

export interface Zone {
  /** user-supplied name */
  name: string;
  /** IDs of contained types */
  typeId: number[];

  // metadata
  /** ID within Audit */
  id: number;
  /** ? */
  usn: number;
  /** modification time as number of milliseconds since UNIX epoch */
  mod: number;
}

export interface Type {
  /** user-supplied name */
  name: string;
  /** type of appliance, e.g. HVAC, Lighting, PlugLoad, ... */
  type: string;
  /** additional information about appliance type, e.g. what type of lighting */
  subtype: string;
  /** ID of enclosing Zone */
  zoneId: number;

  // metadata
  /** ID within Audit */
  id: number;
  /** ? */
  usn: number;
  /** modification time as number of milliseconds since UNIX epoch */
  mod: number;
}
