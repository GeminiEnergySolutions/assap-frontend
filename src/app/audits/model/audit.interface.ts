import {ParseObject} from '../../parse/parse-object.interface';

export interface Audit extends ParseObject {
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

  pendingChanges?: number;
}

export type MinAuditKeys = 'objectId' | 'auditId' | 'createdAt' | 'updatedAt' | 'pendingChanges';

export type AuditIdDto = Pick<Audit, 'objectId' | 'auditId'>;

export type CreateAuditDto = Omit<Audit, Exclude<keyof ParseObject, 'ACL'> | 'auditId' | 'usn' | 'mod'>;

export type UpdateAuditDto = Partial<CreateAuditDto>;

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
  subtype: string | null;
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
