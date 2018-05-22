import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ViewsService {
  api_url = 'http://localhost:8080';
  constructor(private http: HttpClient) { }
}
