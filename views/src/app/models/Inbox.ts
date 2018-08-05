export default class Inbox {
  _id: string;
  type:['blog','chat','other'];
  title: string;
  content: string;
  sender: string;
  date: string;
  isRead: boolean;
  isConfirm: boolean;
  id: string;
  class: string;
  isChecked: boolean;
  index:number;

  constructor() { }
}
