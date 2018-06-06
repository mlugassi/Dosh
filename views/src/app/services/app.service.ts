import NavHeader from '../models/NavHeader';
import Card from '../models/Card';
// import CardComponent from '../catalog/card/card.component';
import User from '../models/User';
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

  login(user: User): Observable<any>{
    return this.http.post(`${this.api_url}/login`, user)
      .pipe(map(res  => res as any || ""));
  }
  signup(user: User): Observable<any>{
    return this.http.post(`${this.api_url}/signup`, user)
      .pipe(map(res  => res as any || ""));
  }
  navbar(): Observable<any[]>{
    return this.http.get(`${this.api_url}/navbar`)
      .pipe(map(res  => res as any[] || []));
  }

  get_catalog(){
    return this.http.get(`${this.api_url}/catalog`)
    .pipe(map(res  => res as Card[] || []));
  }

  get_users(){
    return this.http.get(`${this.api_url}/users`)
    .pipe(map(res  => res as User[] || []));
  }
}