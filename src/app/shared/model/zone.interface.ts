export interface Zone {
  zoneId: number;
  zoneName: string;
  deleteStatus: boolean;
  auditId: number;
}

export type CreateZoneDto = Pick<Zone, 'zoneName' | 'auditId'>;
export type UpdateZoneDto = CreateZoneDto;

export interface ZoneData {
  id: number;
  auditId: number;
  zoneId: number;
  data: Record<string, string | number | boolean>;
}

export type CreateZoneData = Omit<ZoneData, 'id'>;

export interface ZoneWithHvacConnected extends Zone {
  isConnected: boolean;
}

export interface HvacConnectedZone {
  id: number;
  subTypeId: number;
  zoneId: number;
  zone?: Zone;
}
