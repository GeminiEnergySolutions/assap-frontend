import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

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
}
