import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../model/response.interface';
import {Photo} from '../model/photo.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface PhotoQuery {
  auditId: number;
  pageNo: number;
  size: number;
  zoneId?: number;
  equipmentId?: number;
  typeId?: number;
}

@Injectable({providedIn: 'root'})
export class PhotoService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getPhotos(query: PhotoQuery): Observable<Response<{
    photos: Photo[];
    count_total_photos: number;
  }>> {
    const params: Record<string, string | number> = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined));
    return this.http.get<any>(`${environment.url}api/photos`, {params});
  }

  deletePhoto(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/photos`, {params: {id}});
  }

  uploadPhoto(formData: FormData): Observable<Response> {
    return this.http.post<Response>(`${environment.url}api/photos`, formData);
  }
}
