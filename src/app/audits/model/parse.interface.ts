export type ParseResponse =
  | { success: ParseCreateResponse | ParseUpdateResponse }
  | { error: ParseErrorResponse }
  ;

export interface ParseCreateResponse {
  objectId: string;
  createdAt: string;
}

export interface ParseUpdateResponse {
  updatedAt: string;
}

export interface ParseErrorResponse {
  code: number;
  error: string;
}
