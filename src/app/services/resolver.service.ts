import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/Router';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { DataService } from './data.service';
import { StudentService } from './students.service';

@Injectable({ providedIn: 'root' })
export class ResolverService implements Resolve<Student[]> {
  constructor(
    private studentService: StudentService,
    private data: DataService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const students = this.studentService.getStudents();
    if (students.length === 0) {
      // const array = this.data.getData();
      // if (!array) {
      //   return [];
      // } else {
      //   return array;
      // }
      return this.data.getData();
    }
    return students;
  }
}
