import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Programs } from 'src/app/models/programs.model';
import { ProgramsService } from 'src/app/services/programs.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Account } from '../..//models/account.model';
import { AccountService } from '../../services/acccount.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css'],
})
export class ProgramsComponent implements OnInit, OnDestroy {
  dataValue = true;
  forms: FormGroup;
  queryForms: FormGroup;
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
  expandSet = new Set<number>();
  listOfData: Programs[] = [];
  subscription: Subscription;
  editMode = false;
  editedProgram: Programs;
  messageId = '';
  dataAmount = 12;
  queryParams = { key: null, value: null };
  User: Account = {role: null, status: null, uid: null, username: null}

  constructor(
    private program: ProgramsService,
    private message: NzMessageService,
    private account: AccountService
  ) {
    this.years.push(new Date().getFullYear() - 8);
    this.years.push(new Date().getFullYear() - 7);
  }

  ngOnInit(): void {
    this.account.accInfo.subscribe(response => {
      console.log(response);
      if (response) {this.User = response}
    });
    this.account.getAccountInfo();

    if (this.program.Programs.length === 0) {
      this.program.setPrograms(14);
    }

    this.forms = new FormGroup({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      day: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      month: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });

    this.queryForms = new FormGroup({
      param: new FormControl(null),
      day: new FormControl(null),
      date: new FormControl(null),
      month: new FormControl(null),
      year: new FormControl(null),
      description: new FormControl(null),
    });

    this.listOfData = this.program.getPtograms();

    this.subscription = this.program.programsList.subscribe((list) => {
      this.listOfData = this.indexGenerator(list);
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

  submitForm(): void {
    for (const i in this.forms.controls) {
      if (this.forms.controls.hasOwnProperty(i)) {
        this.forms.controls[i].markAsDirty();
        this.forms.controls[i].updateValueAndValidity();
      }
    }

    if (this.forms.valid) {
      this.forms.value.start = this.forms.value.start.toString();
      this.forms.value.end = this.forms.value.end.toString();
      this.messageId = this.message.loading('ትዕዛዞ በሂደት ላይ ነው..', {
        nzDuration: 0,
      }).messageId;

      if (this.editMode) {
        this.editedProgram.start = this.forms.value.start;
        this.editedProgram.end = this.forms.value.end;
        this.editedProgram.day = this.forms.value.day;
        this.editedProgram.date = this.forms.value.date;
        this.editedProgram.month = this.forms.value.month;
        this.editedProgram.year = this.forms.value.year;
        this.editedProgram.description = this.forms.value.description;

        this.program
          .updateProgram(this.editedProgram, this.editedProgram.key)
          .then(() => {
            this.message.remove(this.messageId);
            this.message.info('የመርሀግብሩ መረጃ ተስተካክሏል!!');
          });
        this.editMode = false;
      } else {
        this.program.addProgram(this.forms.value).then(() => {
          this.message.remove(this.messageId);
          this.message.info('መርሀግብር ተጨምሯል!!');
        });
      }
      this.forms.reset();
    }
  }

  editProgram(index, key) {
    this.editMode = true;
    this.editedProgram = this.listOfData[index];
    this.forms.setValue({
      start: new Date(this.listOfData[index].start),
      end: new Date(this.listOfData[index].end),
      day: this.listOfData[index].day,
      date: this.listOfData[index].date,
      month: this.listOfData[index].month,
      year: this.listOfData[index].year,
      description: this.listOfData[index].description,
    });
  }

  deleteProgram(key: string, id: number) {
    this.program.deleteProgram(key, id).then(() => {
      this.message.remove(this.messageId);
      this.message.info('መርሀግብሩ ተሰርዟል!!');
    });
  }

  // use this for display the hours
  hourConverter(date: string) {
    let hours = new Date(date).getHours();
    const minute = new Date(date).getMinutes();
    const min = minute < 10 ? minute.toString() + '0' : minute;
    if (hours > 12) {
      return (hours -= 12) + ' : ' + min + ' ሰዓት';
    } else if (hours === 0) {
      return (hours = 12) + ' : ' + min + ' ሰዓት';
    } else {
      return hours + ' : ' + min + ' ሰዓት';
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  queryData() {
    console.log(this.queryForms.value);
    const param = this.queryForms.value.param;
    const day = this.queryForms.value.day;
    const date = this.queryForms.value.date;
    const month = this.queryForms.value.month;
    const year = this.queryForms.value.year;
    const description = this.queryForms.value.description;
    if (param === 'day') {
      if (day) {
        this.queryParams.key = param;
        this.queryParams.value = day;
        this.program.setPrograms(this.dataAmount, { key: param, value: day });
      }
    } else if (param === 'date') {
      if (date) {
        this.queryParams.key = param;
        this.queryParams.value = date;
        this.program.setPrograms(this.dataAmount, { key: param, value: date });
      }
    } else if (param === 'month') {
      if (month) {
        this.queryParams.key = param;
        this.queryParams.value = month;
        this.program.setPrograms(this.dataAmount, { key: param, value: month });
      }
    } else if (param === 'year') {
      if (year) {
        this.queryParams.key = param;
        this.queryParams.value = year;
        this.program.setPrograms(this.dataAmount, { key: param, value: year });
      }
    } else if (param === 'description') {
      if (description) {
        this.queryParams.key = param;
        this.queryParams.value = description;
        this.program.setPrograms(this.dataAmount, {
          key: param,
          value: description,
        });
      }
    } else if (param === 'specific_date') {
      if (date && month && year) {
        this.queryParams.key = param;
        this.queryParams.value = month + '-' + date + '-' + year;
        this.program.setPrograms(this.dataAmount, {
          key: param,
          value: month + '-' + date + '-' + year,
        });
      }
    } else {
      this.queryParams.key = null;
      this.queryParams.value = null;
      this.program.setPrograms(this.dataAmount);
    }
    this.queryForms.reset();
    // const day = this.queryForms.value.day;
    // const date = this.queryForms.value.date;
    // const month = this.queryForms.value.month;
    // const year = this.queryForms.value.year;
    // const description = this.queryForms.value.description;
    // this.program.setPrograms(12, day, date, month, year, description);
  }

  lengthCalculator(array) {
    return array.length;
  }

  changeDataAmount() {
    const num: number = this.dataAmount;
    if (num) {
      setTimeout(() => {
        console.log(this.queryParams);
        this.program.setPrograms(num, this.queryParams);
      }, 2000);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
