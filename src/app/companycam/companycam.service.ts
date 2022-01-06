import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Photo} from './model/photo';
import {Project} from './model/project';

@Injectable()
export class CompanycamService {

  constructor(
    private http: HttpClient,
  ) {
  }

  test(apiKey: string): Observable<any> {
    return this.http.get('https://api.companycam.com/v2/users/current', {
      headers: {
        Authorization: 'Bearer ' + apiKey,
      },
    });
  }

  getProjects(query?: string): Observable<Project[]> {
    return this.http.get<Project[]>('https://api.companycam.com/v2/projects', {
      params: query ? {query} : {},
    });
  }

  getPhotos(project: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`https://api.companycam.com/v2/projects/${project}/photos`);
  }
}
