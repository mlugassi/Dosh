import NavHeader from '../models/NavHeader';
import Card from '../models/Card';
// import CardComponent from '../catalog/card/card.component';
import User from '../models/User';
import Blog from '../models/Blog';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  api_url = 'http://localhost:80';
  //todoUrl = `${this.api_url}/todo`;

  constructor(
    private http: HttpClient
  ) { }

  checkSession(): Observable<boolean> {
    return this.http.get<any>(`${this.api_url}/check_session`)
      .pipe(map(res => res.status as boolean));
  }
  login(user: User): Observable<any> {
    return this.http.post(`${this.api_url}/login`, user)
      .pipe(map(res => res as any || ""));
  }
  signup(user: User): Observable<any> {
    return this.http.post(`${this.api_url}/signup`, user)
      .pipe(map(res => res as any || ""));
  }
  getKey(user: User): Observable<any> {
    return this.http.post(`${this.api_url}/getKey`, user)
      .pipe(map(res => res as any || ""));
  }
  getKeyWithUuid(uuid: String) {
    var key = this.http.get(`${this.api_url}/getKey/${uuid}`, )
      .pipe(map(res => res as any || ""));
    alert("After get key");
    return key;
  }
  askToResetPassword(email: string): Observable<any> {
    return this.http.post(`${this.api_url}/askToResetPassword`, { email: email })
      .pipe(map(res => res as any || ""));
  }
  doReset(uuid: string, password: string): Observable<any> {
    return this.http.post(`${this.api_url}/doReset`, { uuid: uuid, password: password })
      .pipe(map(res => res as any || ""));
  }
  // checkUuid(uuid: string): Observable<any>{
  //   return this.http.get(`${this.api_url}/resetPassword/${uuid}`)
  //     .pipe(map(res  => res as any || ""));
  // }
  navbar(): any {
    // return this.http.get(`${this.api_url}/navbar`)
    //   .pipe(map(res => res as any[] || []));
    return "";
  }

  get_catalog() {
    return this.http.get(`${this.api_url}/catalog`)
      .pipe(map(res => res as Card[] || []));
  }

  get_users() {
    return this.http.get(`${this.api_url}/users/users`)
      .pipe(map(res => res as User[] || []));
  }

  get_user(userName: String) {
    return this.http.post(`${this.api_url}/users/user`, { userName: userName })
      .pipe(map(res => res as User || null));
  }

  upload_Image(formdata: any) {
    return this.http.post<string>(`${this.api_url}/users/upload`, formdata);
  }
  get_blogs() {
    return this.http.get(`${this.api_url}/blogs/blogs`)
      .pipe(map(res => res as Blog[] || []));
  }
  delete_user(userName: String) {
    return this.http.post<string>(`${this.api_url}/users/delete`, { userName: userName });
  }
  update_user(user: User) {
    return this.http.post<string>(`${this.api_url}/users/update`, user);
  }
  get_inbox() {
    return this.http.get(`${this.api_url}/inbox/inbox`)
      .pipe(map(res => res as any[] || []));
  }
}