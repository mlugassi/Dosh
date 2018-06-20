import Comment from './Comment';

export default class Blog {
  id: Number;
  title: String;
  subTitle: String;
  author: String;
  content: String;
  imgPath: String;
  category: String;
  likes: {
    count: Number,
    users: String[]
  };
  unlikes: {
    count: Number,
    users: String[]
  };
  comments: {
    count: Number,
    comment: [Comment]
  };
  created_at: String;
  updated_at: String;
  isActive: Boolean;

  constructor() { }
}