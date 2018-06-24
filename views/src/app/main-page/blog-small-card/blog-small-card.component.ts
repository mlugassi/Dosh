import { Component, OnInit, Input } from '@angular/core';
import Blog from '../../models/Blog';

@Component({
  selector: 'app-blog-small-card',
  templateUrl: './blog-small-card.component.html',
  styleUrls: ['./blog-small-card.component.css']
})
export class BlogSmallCardComponent implements OnInit {

  @Input() blog: Blog;
  constructor() { }

  ngOnInit() {
  }

}
