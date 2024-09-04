import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {User} from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rootUrl = environment.url + 'authApi/v1/';
  currentLoginUser?: User;

  constructor(private http: HttpClient,
  ) { }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  allstates(): Observable<any> {
    return this.http.get(`${this.rootUrl}all-states/`);
  }

  getUser(): Observable<User> {
    return this.http.get<{ data: User }>(`${this.rootUrl}user/`).pipe(map(r => r.data));
  }

  signUp(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}register/`, data);
  }

  login(data: { email: string; password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.rootUrl}login/`, data);
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.rootUrl}logout/`, null);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}forgot-password/`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}change-password/`, data);
  }
}
