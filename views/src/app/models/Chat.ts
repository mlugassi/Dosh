export default class Chat {
  id: Number;
  owner: String;
  title: String;
  likes: Number;
  unlikes: Number;
  imgPath: String;
  participates: [String];
  messages: [Comment];
    /*text: String,
    sender: String,
    date: Date,
    likes: {
      count: Number,
      users: [String]
    },
    unlikes: {
      count: Number,
      users: [String]
    }
  }];*/
  constructor() {
  }
}
