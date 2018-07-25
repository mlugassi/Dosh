export default class Message {
  _id: String;
  sender: String;
  imgPath: String;
  text: String;
  likes: {
    count: Number,
    users: [String]
  };
  unlikes: {
    count: Number,
    users: [String]
  };
  date: String;

  constructor(_id: String, sender: String, imgPath: String, text: String, date: String) {
    this.sender = sender;
    this.imgPath = imgPath;
    this.text = text;
    this.date = date;
    this._id = _id;
    this.likes = { count: 0, users: [] as [String] };
    this.unlikes = { count: 0, users: [] as [String] };
  }
}