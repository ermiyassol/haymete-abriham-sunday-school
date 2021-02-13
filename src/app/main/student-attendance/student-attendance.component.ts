import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Members } from 'src/app/models/members.model';
import { Programs } from 'src/app/models/programs.model';
import { Sex } from 'src/app/models/sex.model';
import { ProgramsService } from 'src/app/services/programs.service';
import { StudentService } from 'src/app/services/students.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit, OnDestroy {
  radioValue = 'present';
  form: FormGroup;
  expandSet = new Set<number>();
  listOfData = [];
  allStudents = [];
  studentsList = [];
  subscription: Subscription;
  subscription1: Subscription;
  addingMode = false;
  editMode = false;
  index = null;

  constructor(private program: ProgramsService, private student: StudentService) {}

  ngOnInit(): void {

    if (this.program.Programs.length === 0) {
      this.program.setPrograms(7);
    }

    // this.form = new FormGroup({
    //   date: new FormControl(null, Validators.required),
    //   month: new FormControl(null, Validators.required),
    //   year: new FormControl(null, Validators.required),
    // });

    this.listOfData = this.program.getPtograms();

    this.subscription = this.program.programsList.subscribe((list) => {
      this.listOfData = this.indexGenerator(list);
      console.log(this.listOfData);
    });

    this.subscription1 = this.student.attendanceList.subscribe(response => {
      this.allStudents = response;
      this.studentsList = this.allStudents;
      console.log(this.studentsList);
    });
  }

  private indexGenerator(programs: Programs[]) {
    const result: Programs[] = [];
    programs.forEach((cur, index) => {
      cur.id = index;
      result.push(cur);
    });
    return result;
  }

  onSubmit() {

    const members: Members = {status: false, present: {male: [], female: []}, absent: {male: [], female: []}, permission: {male: [], female: []}};
    this.addingMode = false;
    this.editMode = false;

    for (const student of this.allStudents) {
      const sex = student.gender === 'ወንድ' ? 'male' : 'female';
      members.status = true;
      members[student.status][sex].push(student.id + '/' + student.level + '/' + student.fullName);
    }

    this.listOfData[this.index].members = members;
    this.program.updateProgram(this.listOfData[this.index], this.listOfData[this.index].key).then(() => {
      this.addingMode = false;
      this.editMode = false;
      this.index = null;
      this.allStudents = [];
      this.studentsList = this.allStudents;
      // this.studentsList = [];
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  lengthCalculator(array) {
    return array.length;
  }

  enableAdding(index: number) {
    this.index = index;
    this.addingMode = true;
    this.student.getStudentsForAttendance();
  }

  attendanceFiltering(val) {
    if(val === 'ሁሉም') {
      this.studentsList = this.allStudents;
    } else {
      this.studentsList = this.allStudents.filter(cur => cur.level === val);
    }
    console.log(this.studentsList);
  }

  enableEditing(index: number) {
    this.index = index;
    const statArray = ['present', 'absent', 'permission'];
    const genArray = [{name: 'male', value: 'ወንድ'}, {name: 'female', value: 'ሴት'}]
    for (const stat of statArray) {
      for (const gen of genArray) {
        for (const iterator of this.listOfData[index].members[stat][gen.name]) {
          const temp = {
            id: iterator.substr(0, 9),
            fullName: iterator.substr(16),
            level: iterator.substr(10, 5),
            key: this.listOfData[index].key,
            gender: gen.value,
            status: stat
          }
          console.log(temp);
          this.allStudents.push(temp);
          // this.studentsList.push(temp);
        }
      }
    }
    this.studentsList = this.allStudents;
    this.editMode = true;
    // console.log(this.studentsList)
  }

  onCancel() {
    this.editMode = false;
    this.addingMode = false;
    this.index = null;
    this.studentsList = [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }
}
