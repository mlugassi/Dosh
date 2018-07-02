import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormate'
})
export class DateFormatePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    var d = new Date();
    if (d.getDate() == Number(value.substring(8, 10)) &&
      d.getMonth() + 1 == Number(value.substring(5, 7))) {
      if (Number(value.substring(11, 13)) == d.getHours())
        return "Now";
      return value.substring(11, 16);
    }
    else
      return value.substring(8, 10) +
        "/" + value.substring(5, 7);
  }

}
