import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Student } from '../../models/student.model';
import { DataService } from '../../services/data.service';

import { StudentService } from '../../services/students.service';

@Component({
  selector: 'app-stud-edit-new-detail',
  templateUrl: './stud-edit-new-detail.component.html',
  styleUrls: ['./stud-edit-new-detail.component.css'],
})
export class StudEditNewDetailComponent implements OnInit, OnDestroy {
  forms: FormGroup;
  id: number;
  new = true;
  editMode = false;
  genValue = '';
  studTypeValue = '';
  subscription: Subscription;
  submitted = false;
  key: string;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private routes: Router,
    private data: DataService
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.new = params.id == null;
      if (!this.new) {
        this.editMode = !!window.location.pathname.includes(
          '%E1%88%98%E1%88%A8%E1%8C%83_%E1%88%9B%E1%8B%B0%E1%88%BB'
        );
        // ? -> upper code is chrome encryption of መረጃ_ማደሻ
      }
    });
    this.formInit();
  }

  formInit() {
    console.log('form init invoked');
    let student: Student;
    let birthDate = null;
    let birthPlace = null;
    // let blockNumber = null;
    // let city = null;
    // let country = null;
    let educationLevel = null;
    // let email = null;
    let firstName = null;
    let gender = null;
    let hollyChurch = null;
    let hollyEducationLevel = null;
    let hollyName = null;
    let hollyResponsibility = null;
    let hollylevel = null;
    // let homeNumber = null;
    let id = null;
    let jobType = null;
    let joinigDate = null;
    let lastName = null;
    let middleName = null;
    let phoneNumber = null;
    // let place = null;
    // let postalNumber = null;
    let studentType = null;
    // let subcity = null;
    let villageName = null;

    if (!this.new) {
      student = this.studentService.getStudentDetail(this.id);
      if (!student) {
        this.routes.navigate(['../../../የአባላት_ዝርዝር'], {
          relativeTo: this.route,
        });
      } else {
        this.key = student.key;
        birthDate = student.birthDate;
        birthPlace = student.birthPlace;
        // blockNumber = student.blockNumber;
        // city = student.city;
        // country = student.country;
        educationLevel = student.educationLevel;
        // email = student.email;
        firstName = student.firstName;
        gender = student.gender;
        this.genValue = student.gender;
        hollyChurch = student.hollyChurch;
        hollyEducationLevel = student.hollyEducationLevel;
        hollyName = student.hollyName;
        hollyResponsibility = student.hollyResponsibility;
        hollylevel = student.hollylevel;
        // homeNumber = student.homeNumber;
        id = student.id.substr(5, 4);
        jobType = student.jobType;
        joinigDate = student.joinigDate;
        lastName = student.lastName;
        middleName = student.middleName;
        phoneNumber = student.phoneNumber;
        // place = student.place;
        // postalNumber = student.postalNumber;
        studentType = student.studentType;
        this.studTypeValue = student.studentType;
        // subcity = student.subcity;
        villageName = student.villageName;
      }
    } else {
      id = '- - - -';
    }
    const disVal = !!this.new === false && this.editMode === false;
    this.forms = new FormGroup({
      birthDate: new FormControl(
        { value: birthDate, disabled: disVal },
        Validators.required
      ),
      birthPlace: new FormControl(
        { value: birthPlace, disabled: disVal },
        Validators.required
      ),
      // blockNumber: new FormControl(
      //   { value: blockNumber, disabled: disVal },
      //   Validators.required
      // ),
      // city: new FormControl(
      //   { value: city, disabled: disVal },
      //   Validators.required
      // ),
      // country: new FormControl(
      //   { value: country, disabled: disVal },
      //   Validators.required
      // ),
      educationLevel: new FormControl(
        {
          value: educationLevel,
          disabled: disVal,
        },
        Validators.required
      ),
      // email: new FormControl(
      //   { value: email, disabled: disVal },
      //   Validators.required
      // ),
      firstName: new FormControl(
        { value: firstName, disabled: disVal },
        Validators.required
      ),
      gender: new FormControl(gender),
      hollyChurch: new FormControl(
        { value: hollyChurch, disabled: disVal },
        Validators.required
      ),
      hollyEducationLevel: new FormControl(
        {
          value: hollyEducationLevel,
          disabled: disVal,
        },
        Validators.required
      ),
      hollyName: new FormControl(
        { value: hollyName, disabled: disVal },
        Validators.required
      ),
      hollyResponsibility: new FormControl(
        {
          value: hollyResponsibility,
          disabled: disVal,
        },
        Validators.required
      ),
      hollylevel: new FormControl(
        { value: hollylevel, disabled: disVal },
        Validators.required
      ),
      // homeNumber: new FormControl(
      //   { value: homeNumber, disabled: disVal },
      //   Validators.required
      // ),
      id: new FormControl({ value: id, disabled: disVal }, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4)
      ]),
      jobType: new FormControl(
        { value: jobType, disabled: disVal },
        Validators.required
      ),
      joinigDate: new FormControl(
        { value: joinigDate, disabled: disVal },
        Validators.required
      ),
      lastName: new FormControl(
        { value: lastName, disabled: disVal },
        Validators.required
      ),
      middleName: new FormControl(
        { value: middleName, disabled: disVal },
        Validators.required
      ),
      phoneNumber: new FormControl(
        { value: phoneNumber, disabled: disVal },
        Validators.required
      ),
      // place: new FormControl(
      //   { value: place, disabled: disVal },
      //   Validators.required
      // ),
      // postalNumber: new FormControl(
      //   { value: postalNumber, disabled: disVal },
      //   Validators.required
      // ),
      studentType: new FormControl(studentType),
      // subcity: new FormControl(
      //   { value: subcity, disabled: disVal },
      //   Validators.required
      // ),
      villageName: new FormControl(
        { value: villageName, disabled: disVal },
        Validators.required
      ),
    });
  }

  // private idGenerator(): string {
  //   const index = this.studentService.getlastId();
  //   if (index < 10) {
  //     return 'ሀአ/አ/000' + index;
  //   } else if (index < 100) {
  //     return 'ሀአ/አ/00' + index;
  //   } else if (index < 1000) {
  //     return 'ሀአ/አ/0' + index;
  //   } else {
  //     return 'ሀአ/አ/' + index;
  //   }
  // }

  onEditEnabling() {
    this.routes.navigate(['../መረጃ_ማደሻ'], {
      relativeTo: this.route,
    });
  }

  submitForm() {
    for (const i in this.forms.controls) {
      if (this.forms.controls.hasOwnProperty(i)) {
        this.forms.controls[i].markAsDirty();
        this.forms.controls[i].updateValueAndValidity();
      }
    }

    if (this.forms.valid) {
      // date conversion
      this.forms.value.birthDate = new Date(this.forms.value.birthDate)
        .toDateString()
        .toString();
      this.forms.value.joinigDate = new Date(this.forms.value.joinigDate)
        .toDateString()
        .toString();
      this.forms.value.id = 'ሐአ/አ/' + this.forms.value.id;
      if (this.editMode) {
        this.forms.value.key = this.key;
        this.studentService.updateStudent(this.forms.value, this.id);
        this.data.updateData(this.forms.value, this.key);
        this.routes.navigate(['../መረጃ'], {
          relativeTo: this.route,
        });
      } else {
        this.studentService.addStudent(this.forms.value);
        this.routes.navigate(['../የአባላት_ዝርዝር'], { relativeTo: this.route });
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
