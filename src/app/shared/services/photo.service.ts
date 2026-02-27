import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Photo, PhotoInfo, PhotoQuery} from '../model/photo.interface';
import {Response} from '../model/response.interface';

@Injectable({providedIn: 'root'})
export class PhotoService {
  private http = inject(HttpClient);

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

  uploadPhoto(info: PhotoInfo, file: File): Observable<Photo> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(info)) {
      formData.append(key, String(value));
    }
    // Construct filename from current date and file extension (ignore filename, must be less than 50 characters)
    formData.append('photo', file.name);
    formData.append('type', file.type);
    return this.http.post<Response<Photo & {
      upload_url: string;
    }>>(`${environment.url}api/audit/${info.auditId}/photos`, formData).pipe(
      switchMap(({data}) => this.http.put<void>(data.upload_url, file).pipe(
        catchError(err => of(err)),
        switchMap((resultOrError) => this.http.patch<Response>(`${environment.url}api/audit/${info.auditId}/photos/${data.id}`, {
          // mark the new photo as uploaded or failed
          upload_status: resultOrError instanceof HttpErrorResponse ? 'failed' : 'uploaded',
        })),
        // PATCH response is not meaningful {data: null}.
        map(() => data),
      )),
    );
  }
}
