import {Injectable} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {Response} from '../model/response.interface';
import {Photo, PhotoInfo, PhotoQuery} from '../model/photo.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

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
    return this.http.get<Response<{
      photos: Photo[];
      count_total_photos: number;
    }>>(`${environment.url}api/audit/${query.auditId}/photos`, {params});
  }

  deletePhoto(auditId: number, id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/audit/${auditId}/photos/${id}`);
  }

  uploadPhoto(info: PhotoInfo, file: File): Observable<object> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(info)) {
      formData.append(key, String(value));
    }
    // Construct filename from current date and file extension (ignore filename, must be less than 50 characters)
    formData.append('photo', Date.now() + file.name.substring(file.name.lastIndexOf('.')));
    formData.append('type', file.type);
    return this.http.post<{ upload_url: string }>(`${environment.url}api/audit/${info.auditId}/photos`, formData).pipe(
      switchMap(({upload_url}) => this.http.put(upload_url, file, {
        responseType: 'blob',
      })),
    );
  }
}
