import NavHeader from '../models/NavHeader';
// import CardComponent from '../catalog/card/card.component';
import User from '../models/User';
import Blog from '../models/Blog';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Inbox from '../models/Inbox';


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

  get_users() {
    return this.http.get(`${this.api_url}/users/users`)
      .pipe(map(res => res as User[] || []));
  }

  get_user(userName: String = undefined) {
    return this.http.post(`${this.api_url}/users/user`, { userName: userName })
      .pipe(map(res => res as User || null));
  }

  upload_Image(formdata: any) {
    return this.http.post<string>(`${this.api_url}/users/upload`, formdata);
  }

  /* BLOGS REST */
  get_all_blogs() {
    return this.http.get(`${this.api_url}/blogs/all_blogs`)
      .pipe(map(res => res as Blog[] || []));
  }
  get_my_blogs() {
    return this.http.get(`${this.api_url}/blogs/my_blogs`)
      .pipe(map(res => res as Blog[] || []));
  }
  get_by_category(category: string) {
    return this.http.get(`${this.api_url}/blogs/category` + category)
      .pipe(map(res => res as Blog[] || []));
  }
  get_favorite_blogs() {
    return this.http.get(`${this.api_url}/blogs/favorite_blogs`)
      .pipe(map(res => res as Blog[] || []));
  }
  most_commented_blogs() {
    return this.http.get(`${this.api_url}/blogs/most_commented_blogs`)
      .pipe(map(res => res as Blog[] || []));
  }

  get_recent_posts() {
    return this.http.get(`${this.api_url}/blogs/recent_posts`)
      .pipe(map(res => res as Blog[] || []));
  }
  get_all_blogs_but_mine() {
    return this.http.get(`${this.api_url}/blogs/all_blogs_but_mine`)
      .pipe(map(res => res as Blog[] || []));
  }
  get_blog(blogId) {
    return this.http.post(`${this.api_url}/blogs/blog`, { id: blogId })
      .pipe(map(res => res as Blog));
  }

  add_blog(title, content) {
    return this.http.post<any>(`${this.api_url}/blogs/add`, { title: title, content: content });
  }

  update_blog(blogId, title, content) {
    return this.http.post<any>(`${this.api_url}/blogs/update`, { id: blogId, title: title, content: content });
  }

  upload_blog_Image(formdata: any) {
    return this.http.post<any>(`${this.api_url}/blogs/upload`, formdata);
  }


  delete_blog(blogId) {
    return this.http.post<any>(`${this.api_url}/blogs/delete`, { id: blogId });
  }

  add_comment(blogId, content, imgPath, date) {
    return this.http.post<any>(`${this.api_url}/blogs/add_comment`, { blogId: blogId, content: content, imgPath: imgPath, date: date });
  }

  add_reply(blogId, commentId, content, imgPath, date) {
    return this.http.post<any>(`${this.api_url}/blogs/add_reply`, { blogId: blogId, commentId: commentId, content: content, imgPath: imgPath, date: date });
  }

  do_like(blogId, commentId = undefined, replyId = undefined) {
    return this.http.post<any>(`${this.api_url}/blogs/do_like`, { blogId: blogId, commentId: commentId, replyId: replyId });
  }
  do_unlike(blogId, commentId = undefined, replyId = undefined) {
    return this.http.post<any>(`${this.api_url}/blogs/do_unlike`, { blogId: blogId, commentId: commentId, replyId: replyId });
  }
  undo_like(blogId, commentId = undefined, replyId = undefined) {
    return this.http.post<any>(`${this.api_url}/blogs/undo_like`, { blogId: blogId, commentId: commentId, replyId: replyId });
  }
  undo_unlike(blogId, commentId = undefined, replyId = undefined) {
    return this.http.post<any>(`${this.api_url}/blogs/undo_unlike`, { blogId: blogId, commentId: commentId, replyId: replyId });
  }
  get_who_am_I() {
    return this.http.get<any>(`${this.api_url}/blogs/who_am_I`);
  }

  /*END BLOGS REST */
  delete_user(userName: String) {
    return this.http.post<string>(`${this.api_url}/users/delete`, { userName: userName });
  }
  update_user(user: User, oldPassword = undefined) {
    return this.http.post<any>(`${this.api_url}/users/update`, { user, oldPassword: oldPassword });
  }
  get_inbox() {
    return this.http.get(`${this.api_url}/inbox/gatAll`)
      .pipe(map(res => res as Inbox[] || []));
  }
  delete_inbox(inbox: string) {
    return this.http.post(`${this.api_url}/inbox/delete`, { inboxId: inbox })
      .pipe(map(res => res as any || ""));
  }
  readInbox(inbox: String) {
    return this.http.post(`${this.api_url}/inbox/readInbox`, { inboxId: inbox })
      .pipe(map(res => res as any || ""));
  }
  unreadInbox(inbox: String) {
    return this.http.post(`${this.api_url}/inbox/unreadInbox`, { inboxId: inbox })
      .pipe(map(res => res as any || ""));
  }
  confirmInbox(inbox: String) {
    return this.http.post(`${this.api_url}/inbox/confirmInbox`, { inboxId: inbox })
      .pipe(map(res => res as any || ""));
  }
  rejectInbox(inbox: String) {
    return this.http.post(`${this.api_url}/inbox/rejectInbox`, { inboxId: inbox })
      .pipe(map(res => res as any || ""));
  }
}