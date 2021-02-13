import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

import { Student } from '../models/student.model';
import { StudentService } from './students.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(
    private http: HttpClient,
    private student: StudentService,
    public db: AngularFireDatabase
  ) {}

  saveData(student: Student[]) {
    this.http
      .put('https://haymete-abrihame.firebaseio.com/students.json', student)
      .subscribe((response) => {});
  }

  getData(): Observable<Student[]> {
    return this.db
      .list('students')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          const arr = changes.map((c, i) => {
            let temp: any;
            temp = c.payload.val();
            temp.key = c.payload.key;
            return temp;
          });
          return arr;
        }),
        tap((student: Student[]) => {
          this.student.setStudents(student);
          console.log(student);
          return student;
        })
      );
    //
    // return this.http
    //   .get<{ id: Student[] }>(
    //     'https://haymete-abrihame.firebaseio.com/students.json'
    //   )
    //   .pipe(
    //     map((studList) => {
    //       const resArray = [];
    //       for (const i in studList) {
    //         if (studList.hasOwnProperty(i)) {
    //           resArray.push({ ...studList[i], key: i });
    //         }
    //       }
    //       return resArray;
    //     }),
    //     tap((student) => {
    //       console.log(student);
    //       this.student.setStudents(student);
    //     })
    //   );
  }

  updateData(data: Student, key: string) {
    this.db
      .list('students')
      .update(key, data)
      .then((response) => {});
  }
}
