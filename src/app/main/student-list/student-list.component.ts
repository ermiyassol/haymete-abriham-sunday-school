import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/students.service';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/acccount.service';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit, OnDestroy {
  listOfStudents: Student[] = [];
  // listOfStudents: Observable<Student[]>;
  search = '';
  subscription: Subscription;
  // students: Observable<Student[]>;
  User: Account = {role: null, status: null, uid: null, username: null}


  constructor(
    private route: Router,
    private routes: ActivatedRoute,
    private studentService: StudentService,
    private data: DataService,
    private account: AccountService
  ) {}

  ngOnInit(): void {
    this.account.accInfo.subscribe(response => {
      console.log(response);
      if (response) {this.User = response}
    });
    this.account.getAccountInfo();

    this.data.getData().subscribe(); // ! place this if there is a way
    this.listOfStudents = this.studentService.getStudents();
    this.subscription = this.studentService.studentsList.subscribe((list) => {
      this.listOfStudents = list;
    });
    // console.log(this.listOfStudents);
  }

  onViewProfile(id: number) {
    this.route.navigate(['../' + id + '/አባላት/መረጃ'], {
      relativeTo: this.routes,
    });
    // this.route.navigate(['አባላት/1/መረጃ']);
  }

  sort(index: string) {
    this.studentService.sort(index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
