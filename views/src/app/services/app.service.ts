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

  post_login(user: User): Observable<NavHeader[]>{
    return this.http.post(`${this.api_url}/login`, user)
      .pipe(map(res  => res as NavHeader[] || []));
  }
  index(): Observable<any[]>{
    return this.http.get(`${this.api_url}/stam`)
      .pipe(map(res  => res as any[] || []));
  }

  get_catalog(){
    return this.http.get(`${this.api_url}/catalog`)
    .pipe(map(res  => res as Card[] || []));
  }
}

// @Injectable()
// export class TodoService {

//   //Create todo, takes a ToDo Object
//   createTodo(todo: ToDo): Observable<ToDo[]>{
//     return this.http.post(`${this.todoUrl}`, todo)
//       .map(res  => res as ToDo[] || []);
//   }

//   //Read todo, takes no arguments
//   getToDos(): Observable<ToDo[]>{
//     let getUrl = `${this.todoUrl}/list`;
//     return this.http.get(getUrl)
//       .map(res  => res as ToDo[] || []);
//   }

//   //Delete todo, takes a ToDo Object
//   deleteTodo(todo: ToDo): Observable<ToDo[]> {
//     //Delete the object by the id
//     let deleteUrl = `${this.todoUrl}/${todo._id}`;
//     return this.http.delete(deleteUrl)
//       .map(res  => res as ToDo[] || []);
//   }

//   //Update todo, takes a ToDo Object as parameter
//   editTodo(todo:ToDo){
//     let editUrl = `${this.todoUrl}/${todo._id}`
//     //returns the observable of http put request
//     return this.http.put(editUrl, {text: todo.text})
//       .map(res  => res as ToDo[] || []);
//   }

//   //Default Error handling method.
//   private handleError(error: any): Promise<any> {
//     console.error('An error occurred', error); // for demo purposes only
//     return Promise.reject(error.message || error);
//   }
// }
