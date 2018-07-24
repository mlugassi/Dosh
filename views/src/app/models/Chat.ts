export default class Chat {
  id: Number;
  owner: String;
  participates: [String];
  messages: [{
    text: String,
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
  }];
  imgPath: String;

  constructor(imgPath: String, title: String, subTitle: String, btnContent: String) {
    this.imgPath = imgPath;
  }
}
