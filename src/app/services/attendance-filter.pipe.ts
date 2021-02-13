import { Pipe, PipeTransform } from '@angular/core';

interface Data {
  id: string;
  name: string;
  level: string;
  total: number;
  info: string[];
  }

@Pipe({
  name: 'attendanceFilter'
})
export class AttendanceFilterPipe implements PipeTransform {
  arr: Data[];
  transform(obj: any, search: any): Data[] {
    this.arr = [];
    if (search === '') {
    return obj;
    } else {
      for (const data of obj) {
        if (data.level === search) {
          this.arr.push(data);
        }
      }
    }
    return this.arr;
  }
}
