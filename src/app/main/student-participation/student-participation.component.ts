import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Programs } from 'src/app/models/programs.model';
import { Student } from 'src/app/models/student.model';
import { ProgramsService } from 'src/app/services/programs.service';
import { StudentService } from 'src/app/services/students.service';

@Component({
  selector: 'app-student-participation',
  templateUrl: './student-participation.component.html',
  styleUrls: ['./student-participation.component.css']
})
export class StudentParticipationComponent implements OnInit, OnDestroy {
  form: FormGroup;
  options: string[] = [
    'መዝሙር ጥናት እና ኮርስ',
    'ኮርስ',
    'የህብረት ጸሎት',
    'ወረብ ጥናት',
    'መዝሙር ጥናት',
    'ልዩ የትምህርት ጉባኤ',
    'ዝክረ ቅዱስ ገብርኤል',
    'አንድነት ጉባኤ',
  ];
  days = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሀሙስ', 'አርብ', 'ቅዳሜ'];
  dates = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];
  months = [
    'መስከረም',
    'ጥቅምት',
    'ህዳር',
    'ታህሳስ',
    'ጥር',
    'የካቲት',
    'መጋቢት',
    'ሚያዚያ',
    'ግንቦት',
    'ሰኔ',
    'ሀምሌ',
    'ነሐሴ',
    'ጳጉሜ',
  ];
  years = [];
  Programs: Programs[] = [];
  Students: any[] = [];
  Data: {id: string, name: string, level: string, total: number, info: string[]}[] = [];
  Head: {date: string, more: string}[] = [];
  subscription: Subscription;
  error = null;
  status = '';


queryParams = { key: null, value: null };

constructor(
    private program: ProgramsService, private student: StudentService
  ) {
    this.years.push(new Date().getFullYear() - 8);
    this.years.push(new Date().getFullYear() - 7);
  }


  ngOnInit(): void {
    this.form = new FormGroup({
          param: new FormControl(''),
          day: new FormControl(null),
          date: new FormControl(null),
          month: new FormControl(null),
          year: new FormControl(null),
          description: new FormControl(null),
          amount: new FormControl(null, Validators.required)
        });

    this.subscription = this.program.programsList.subscribe((response) => {
          this.Programs = response;
          this.student.getStudentsForAttendance();
        });

    this.subscription = this.student.attendanceList.subscribe(response => {
          this.Students = response;
          this.calculateAttendance();
        });
      }

     private calculateAttendance() {
        this.Data = [];
        this.Head = [];
        this.Programs.forEach(cur => {
          const temp = {
            date: cur.specific_date,
            more: cur.day + ' - ' + cur.description
          }
          this.Head.push(temp);
        });
        

        this.Students.forEach(stud => {
          const gender = stud.gender === 'ሴት' ? 'female' : 'male';
          console.log(gender);
          const name = stud.fullName;
          const id = stud.id.substr(5);
          const level = stud.level;
          const info = [];
          let total = 0;
          this.Programs.forEach((prog, index) => {
            prog.members.present[gender].forEach(cur => {
              if (cur.indexOf(id) !== -1) {
                info.push('check');
                total++;
              }
            });
            // 


            prog.members.absent[gender].forEach(cur => {
              if (cur.indexOf(id) !== -1) {
                info.push('close');
              }
            });
            prog.members.permission[gender].forEach(cur => {
              if (cur.indexOf(id) !== -1) {
                info.push('issues-close');
              }
            });
            info[index] ? console.log(info[index]) : info.push('question');
          });
          this.Data.push({id: id, name: name, level: level, total: total, info: info});
        });

        console.log(this.Head);
        console.log(this.Data);
      }

  queryData() {
    this.error = null;
    const param = this.form.value.param;
    const day = this.form.value.day;
    const date = this.form.value.date;
    const month = this.form.value.month;
    const year = this.form.value.year;
    const description = this.form.value.description;
    const amount = this.form.value.amount;
    if(this.form.valid) {
      if (param === 'day') {
        if (day) {
          this.queryParams.key = param;
          this.queryParams.value = day;
          this.program.setPrograms(12, { key: param, value: day });
        } else {
          this.error = 'ዕለት በትክክል ያስገቡ!!';
        }
      } else if (param === 'date') {
        if (date) {
          this.queryParams.key = param;
          this.queryParams.value = date;
          this.program.setPrograms(12, { key: param, value: date });
        } else {
          this.error = 'ቀን በትክክል ያስገቡ!!';
        }
      } else if (param === 'month') {
        if (month) {
          this.queryParams.key = param;
          this.queryParams.value = month;
          this.program.setPrograms(12, { key: param, value: month });
        } else {
          this.error = 'ወር በትክክል ያስገቡ!!';
        }
      } else if (param === 'year') {
        if (year) {
          this.queryParams.key = param;
          this.queryParams.value = year;
          this.program.setPrograms(12, { key: param, value: year });
        } else {
          this.error = 'አመተ ምህረት በትክክል ያስገቡ!!';
        }
      } else if (param === 'description') {
        if (description) {
          this.queryParams.key = param;
          this.queryParams.value = description;
          this.program.setPrograms(12, {
            key: param,
            value: description,
          });
        } else {
          this.error = 'የመርሐግብር አይነት በትክክል ይምረጡ';
        }
      } else if (param === 'specific_date') {
        if (date && month && year) {
          this.queryParams.key = param;
          this.queryParams.value = month + '-' + date + '-' + year;
          this.program.setPrograms(12, {
            key: param,
            value: month + '-' + date + '-' + year,
          });
        } else {
          this.error = 'ቀን፣ ወር እና አመተ ምህረት በትክክል ያስገቡ!!';
        }
      } else {
        this.queryParams.key = null;
        this.queryParams.value = null;
        this.program.setPrograms(amount);
      }
      this.form.reset();
    } else {
      this.error = 'የመርሐግብር ብዛት ያስገቡ!!';
    }
    // const day = this.form.value.day;
    // const date = this.form.value.date;
    // const month = this.form.value.month;
    // const year = this.form.value.year;
    // const description = this.form.value.description;
    // this.program.setPrograms(12, day, date, month, year, description);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
