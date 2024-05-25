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
}

export type CreateZoneData = Omit<ZoneData, 'id'>;

export interface ConnectedZone extends Zone{
  auditName: string;
  isConnected: boolean;
}
