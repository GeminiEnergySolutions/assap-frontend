export interface ParseObject {
  /** record ID */
  objectId: string;
  /** record creation date and time as ISO-8601 UTC timestamp */
  createdAt: string;
  /** record modification date and time as ISO-8601 UTC timestamp */
  updatedAt: string;

  ACL?: ACL;
}

export type ACL = Record<string | '*' | `role:${string}`, {
  read: boolean;
  write: boolean;
}>;
