import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {User} from '../model/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  currentLoginUser?: User;

  constructor(
    private http: HttpClient,
  ) {
  }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  getUser(): Observable<User> {
    return this.http.get<{ data: User }>(`${environment.url}authApi/v1/user`).pipe(map(r => r.data));
  }

  signUp(data: {
    userName: string;
    email: string;
    password: string;
    password_confirm: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${environment.url}authApi/v1/user`, {data});
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${environment.url}authApi/v1/login`, data);
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.url}authApi/v1/logout`, null);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${environment.url}authApi/v1/forgot-password`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${environment.url}authApi/v1/change-password`, data);
  }
}
