import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from '../services/acccount.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isVisible = false;
  form!: FormGroup;
  errorMessage = null;
  isLoading = false;
  subscription: Subscription;

  constructor(private fb: FormBuilder, private route: Router, private account: AccountService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['ermi@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });

    this.subscription = this.account.errorMessage.subscribe(response => {
      if (response !== '') {
        this.errorMessage = response;
      } else {
        this.isVisible = false;
        this.route.navigate(['ሰንበት_ት/ቤት']);
      }
      this.isLoading = false;
    });
  }

  submitForm(): void {
    this.errorMessage = null;
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      this.isLoading = true;
      this.account.login(this.form.value).subscribe(() => {},
      error => {
        this.errorMessage = error;
        this.isLoading = false;
      });
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  gotoLibrary() {
    this.route.navigate(['ቤተ_መጽሐፍት/መጽሐፍት_መፈለጊያ']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
