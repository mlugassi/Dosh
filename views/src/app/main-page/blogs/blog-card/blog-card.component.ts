import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import Blog from '../../../models/Blog';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {

  isChecked: Boolean;

  @Input() blog: Blog;
  @Input() inManage: Boolean;
  @Input() isAdmin: Boolean;
  @Input() isOwn: Boolean;

  @Output() checkEvent = new EventEmitter<{ blog: Blog, isChecked: boolean }>();

  constructor() { }

  ngOnInit() {
    this.isChecked = false;
  }
  onClick() {
    this.isChecked = !this.isChecked;
    this.checkEvent.emit({
      blog: this.blog,
      isChecked: this.isChecked.valueOf()
    });
  }
}
