import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Members } from '../models/members.model';
import { Programs } from '../models/programs.model';
import { Temhirt } from '../models/temhirt.model';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  Programs: Programs[] = [];
  programsList = new Subject<Programs[]>();
  // programDataAmount = 12;

  constructor(private db: AngularFireDatabase) {}

  getPtograms() {
    return this.Programs.slice();
  }

  addProgram(program) {
    program.specific_date =
      program.month + '-' + program.date + '-' + program.year;
    program.lecture = [];
    program.song = [];
    program.members = [];
    program.message = [];
    this.Programs.unshift(program);
    this.programsList.next(this.Programs);
    return this.db.list('programs').push(program);
  }

  setPrograms(num = 12, query = { key: null, value: null }) {
    const reference = this.db.database.ref('programs');
    const ref = query.key
      ? reference.orderByChild(query.key).equalTo(query.value)
      : reference;

    ref.limitToLast(num).on('value', (snapshot) => {
      this.Programs = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: any;
          temp = snapshot.val()[key];
          temp.key = key;
          temp.lecture = temp.lecture ? temp.lecture : [];
          temp.song = temp.song ? temp.song : [];
          temp.members = temp.members ? this.memberConfiguration(temp.members) : [];
          temp.message = temp.message ? temp.message : [];
          this.Programs.push(temp);
        }
      }
      this.Programs.reverse();
      this.programsList.next(this.Programs);
    });
  }

  private memberConfiguration (members) {
    const member: Members = members;
    member.status = members.status ? members.status : false;
    member.present = members.present ? members.present : {male: [], female: []};
    member.present.male = members.present.male ? members.present.male : [];
    member.present.female = members.present.female ? members.present.female : [];
    member.absent = members.absent ? members.absent : {male: [], female: []};
    member.absent.male = members.absent.male ? members.absent.male : [];
    member.absent.female = members.absent.female ? members.absent.female : [];
    member.permission = members.permission ? members.permission : {male: [], female: []};
    member.permission.male = members.permission.male ? members.permission.male : [];
    member.permission.female = members.permission.female ? members.permission.female : [];
    return member;
  }

  updateProgram(data: Programs, key: string) {
    this.Programs[data.id] = data;
    this.programsList.next(this.Programs);
    return this.db.list('programs').update(key, data);
  }

  deleteProgram(key: string, index: number) {
    this.Programs.splice(index, 1);
    this.programsList.next(this.Programs);
    return this.db.list('programs').remove(key);
  }
}
