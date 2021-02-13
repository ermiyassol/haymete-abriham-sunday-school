import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { map, tap } from 'rxjs/operators';
import { Attendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  Students: Student[] = [];
  property: string;

  statisticTable = [];

  studentsList = new Subject<Student[]>();
  attendanceList = new Subject<Attendance[]>();
  distinct = [];
  i = 0;

  constructor(private db: AngularFireDatabase) {}

  getStudentStatistics() {
    this.statisticTable = [
      {
        type: 'gender',
        option: [
          { name: 'ወንድ', value: 0 },
          { name: 'ሴት', value: 0 },
        ],
      },
      {
        type: 'hollyResponsibility',
        option: [
          { name: 'ዲቁና', value: 0 },
          { name: 'ክህነት', value: 0 },
          { name: 'የለም', value: 0 },
        ],
      },
      {
        type: 'jobType',
        option: [
          { name: 'የመንግስት ሰራተኛ', value: 0 },
          { name: 'የግል ሰራተኛ', value: 0 },
          { name: 'የግል ስራ', value: 0 },
          { name: 'ተማሪ', value: 0 },
        ],
      },
      {
        type: 'educationLevel',
        option: [
          { name: '10 - 12', value: 0 },
          { name: 'ሰርተፍኬት', value: 0 },
          { name: 'ዲፕሎማ', value: 0 },
          { name: 'ዲግሪ', value: 0 },
          { name: 'ማስተርስ', value: 0 },
          { name: 'ሌላ', value: 0 },
        ],
      },
      {
        type: 'hollyEducationLevel',
        option: [
          { name: 'ቀዳማይ', value: 0 },
          { name: 'ካዕላይ', value: 0 },
          { name: 'ሳልሳይ', value: 0 },
          { name: 'ራዕባይ', value: 0 },
        ],
      },
      {
        type: 'studentType',
        option: [
          { name: 'መደበኛ', value: 0 },
          { name: 'የርቀት', value: 0 },
        ],
      },
    ];
    this.Students.forEach((cur) => {
      this.statisticTable.forEach((stat) => {
        stat.option.forEach((opt) => {
          if (cur[stat.type] === opt.name) {
            opt.value++;
          }
        });
      });
    });
    return this.statisticTable;
  }

  addStudent(student: Student) {
    // this.Students.push(student);
    this.db.list('students').push(student);
  }

  getStudentsForAttendance() {
    const ref = this.db.database.ref('students').orderByChild('studentType').equalTo('መደበኛ');
    const attendanceList: Attendance[] = [];
    ref.once('value', (snapshot) => {
      this.Students = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: any;
          temp = snapshot.val()[key];
          attendanceList.push({
            id: temp.id,
            fullName: temp.firstName + ' ' + temp.middleName,
            gender: temp.gender,
            status: 'absent',
            key: key,
            level: temp.hollylevel
          }
          );
        }
      }
    });
    this.attendanceList.next(attendanceList);
  }

  setStudents(student: Student[]) {
    if (student) {
      this.Students = student;
      this.studentsList.next(this.Students.slice());
    } else {
      this.Students = [];
    }
  }

  // getlastId() {
  //   return this.Students.length;
  // }

  getStudents() {
    return this.Students.slice();
  }

  getStudentDetail(index: number) {
    return this.Students[index];
  }

  updateStudent(student: Student, index: number) {
    this.Students[index] = student;
  }

  sort(index: string) {
    let r1: number;
    let r2: number;
    if (this.property !== index) {
      r1 = -1;
      r2 = 1;
      this.property = index;
    } else {
      r1 = 1;
      r2 = -1;
      this.property = '';
    }

    let nameA;
    let nameB;
    this.Students.sort((a, b) => {
      nameA = a[index];
      nameB = b[index];
      if (nameA < nameB) {
        return r1;
      }
      if (nameA > nameB) {
        return r2;
      }
      return 0;
    });
    this.studentsList.next(this.Students.slice());
  }

  // testValue() {
  //   if (this.Students.length === 0) {
  //     this.data.getData();
  //   }
  // }
}
