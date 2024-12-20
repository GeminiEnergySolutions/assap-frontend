import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {User} from '../model/user.interface';
import {Response} from '../model/response.interface';

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
    return this.http.get<Response<User>>(`${environment.url}authApi/v1/user`).pipe(map(r => r.data));
  }

  signUp(data: {
    userName: string; // TODO still required?
    email: string;
    password: string;
    password_confirm: string;
    role: string;
  }): Observable<Response> { // TODO what is data?
    return this.http.post<Response>(`${environment.url}authApi/v1/user`, data);
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<Response<{ token: string; user: User }>> {
    return this.http.post<Response<{ token: string; user: User }>>(`${environment.url}authApi/v1/login`, data);
  }

  logout(): Observable<Response> {
    return this.http.post<Response>(`${environment.url}authApi/v1/logout`, null);
  }

  forgotPassword(data: {
    email: string;
  }): Observable<Response> {
    return this.http.post<Response>(`${environment.url}authApi/v1/forgotPassword`, data);
  }

  changePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Observable<Response> {
    return this.http.post<Response>(`${environment.url}authApi/v1/changePassword`, data);
  }
}
