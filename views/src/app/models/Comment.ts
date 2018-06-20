import Reply from './Reply';

export default class Comment {
  _id: String;
  writer: String;
  imgPath: String;
  content: String;
  likes: {
    count: Number,
    users: [String]
  };
  unlikes: {
    count: Number,
    users: [String]
  };
  replies: [Reply];
  created_at: String;

  constructor(_id: String, writer: String, imgPath: String, content: String, created_at: String) {
    this.writer = writer;
    this.imgPath = imgPath;
    this.content = content;
    this.created_at = created_at;
    this._id = _id;
    this.likes = { count: 0, users: [] as [String] };
    this.unlikes = { count: 0, users: [] as [String] };
    this.replies = [] as [Reply];
  }
}