export default class Message {
  _id: String;
  isJoinMessage: boolean;
  sender: String;
  imgPath: String;
  text: String;
  room: String;
  likes: [String];
  unlikes: [String];
  date: String;

  constructor(_id: String=undefined, sender: String="", imgPath: String="", text: String="", date: String=Date.now().toString()) {
    this.sender = sender;
    this.imgPath = imgPath;
    this.text = text;
    this.date = date;
    this._id = _id;
    this.likes = [] as [String];
    this.unlikes = [] as [String];
  }
}