export interface Photo {
  id: string,
  creator_name: string;
  photo_url: string;
  captured_at: number;
  uris: {
    type: string;
    uri: string;
    url: string;
  }[];
}
