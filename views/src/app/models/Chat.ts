import Message from "./Message";

export default class Chat {
  id: Number;
  owner: String;
  title: String;
  likes: Number;
  unlikes: Number;
  imgPath: String;
  participates: [String];
  messages: [Message];
  constructor() {
  }
}
