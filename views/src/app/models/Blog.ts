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
    comment: [{
      _id: string;
      writer: String,
      imgPath: String,
      content: String,
      likes: {
        count: Number,
        users: [String]
      },
      unlikes: {
        count: Number,
        users: [String]
      },
      replies: [{
        writer: String,
        imgPath: String,
        content: String,
        likes: {
          count: Number,
          users: [String]
        },
        unlikes: {
          count: Number,
          users: [String]
        },
        created_at: Date
      }],
      created_at: Date
    }]
  };
  created_at: string;
  updated_at: string;
  isActive: Boolean;

  constructor() { }
}