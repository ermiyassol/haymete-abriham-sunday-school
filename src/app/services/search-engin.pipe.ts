import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../models/student.model';

@Pipe({
  name: 'searchEngin',
  // pure: false
})
export class SearchEnginPipe implements PipeTransform {
  arr: Student[];
  transform(Students: any, search: string): Student[] {
    if (search === '') {
    // console.log(search);
    return Students;
    }
    this.arr = [];
    for (const student of Students) {
      if (
        student.id.includes(search) ||
        student.firstName.includes(search) ||
        student.middleName.includes(search) ||
        student.lastName.includes(search) ||
        student.hollyName.includes(search) ||
        student.gender.includes(search) ||
        student.birthDate.includes(search) ||
        student.hollyResponsibility.includes(search) ||
        student.villageName.includes(search) ||
        student.hollylevel.includes(search) ||
        student.educationLevel.includes(search) ||
        student.hollyEducationLevel.includes(search) ||
        student.studentType.includes(search)
      ) {
        this.arr.push(student);
      }
    }

    return this.arr;
  }
}
