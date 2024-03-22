export interface Zone {
  zoneId: number;
  zoneName: string;
  deleteStatus: boolean;
  auditId: number;
}

export interface ZoneDataResponse {
  message: string;
  data: ZoneData;
}

export interface ZoneData {
  id: number;
  auditId: number;
  zoneId: number;
  data: Record<string, string | number | boolean>;
  required?: null;
}

export type CreateZoneData = Omit<ZoneData, 'id'>;
