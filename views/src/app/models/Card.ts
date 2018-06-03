export default class Card {
  imgPath:String;
  title:String;
  subTitle:String;
  btnContent:String;
  constructor(imgPath:String , title:String, subTitle:String,btnContent:String) {
    this.imgPath = imgPath;
    this.title = title;
    this.subTitle = subTitle;
    this.btnContent = btnContent;
  }
  }
  