import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormate'
})
export class DateFormatePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    var d = new Date();
    var date = new Date(value);
    if (d.getTime() - date.getTime() < 3600000)
      return ((d.getTime() - date.getTime()) / 60000).toFixed(0) + " minutes ago";
    if (d.getDate() == date.getDate() &&
      d.getMonth() == date.getMonth())
      return (date.getHours().toString().length > 1 ? date.getHours() : "0" + date.getHours()) + ":" +
        (date.getMinutes().toString().length > 1 ? date.getMinutes() : "0" + date.getMinutes());
    else
      return (date.getDate().toString().length > 1 ? date.getDate() : ("0" + date.getDate())) +
        "/" + ((date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)));
  }

}
