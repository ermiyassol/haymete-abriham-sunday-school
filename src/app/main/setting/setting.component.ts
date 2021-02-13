import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/acccount.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})

export class SettingComponent implements OnInit {
  form!: FormGroup;
  
    constructor(private fb: FormBuilder, private account: AccountService) {}
  
    ngOnInit(): void {
      this.form = this.fb.group({
        password: [null, [Validators.required, Validators.minLength(6)]],
      });
    }

  submitForm(): void {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }
    if (this.form.valid) {
      this.account.changePassword(this.form.value.password).subscribe(() => {
        this.form.reset();
      });
    }
  }
}
