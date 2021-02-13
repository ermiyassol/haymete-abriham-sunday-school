import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/acccount.service';
import { Account } from 'src/app/models/account.model';

  
 
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  Accounts = [];
  subscription: Subscription;
  error = null;
  isLoading = false;
  User: Account = {role: null, status: null, uid: null, username: null}

  constructor(private accountService: AccountService, private account: AccountService) {}

  ngOnInit(): void {
    this.account.accInfo.subscribe(response => {
      console.log(response);
      if (response) {this.User = response}
    });
    this.account.getAccountInfo();

    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', Validators.required),
      status: new FormControl(true),
    });
    this.accountService.getAccounts();
    this.subscription = this.accountService.accountsList.subscribe(response => {
      this.isLoading = false;
      this.Accounts = response;
    });
  }

  submitForm(): void {
    this.error = null;
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    if (this.form.valid) {
      if(!this.form.value.username.includes(' ')) {
        this.error = 'የአባሉ ሙሉ ስም ይሄ አይደለም እባክዎ በትክክል ያስገቡ!!'
      } else {
        this.isLoading = true;
        this.accountService.signup(this.form.value).subscribe(response => {
        }, errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        });
        this.form.reset();
      }
    }
  }

  statusChange(index: number) {
    this.accountService.updateAccount(this.Accounts[index]).then(() => {
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
