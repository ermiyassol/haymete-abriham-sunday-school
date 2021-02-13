import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Programs } from 'src/app/models/programs.model';
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-mezmur-checkmark',
  templateUrl: './mezmur-checkmark.component.html',
  styleUrls: ['./mezmur-checkmark.component.css'],
})
export class MezmurCheckmarkComponent implements OnInit, OnDestroy {
  form: FormGroup;
  expandSet = new Set<number>();
  listOfData = [];
  subscription: Subscription;
  addingMode = false;
  editMode = false;
  index = null;

  constructor(private program: ProgramsService) {}

  ngOnInit(): void {

    if (this.program.Programs.length === 0) {
      this.program.setPrograms(7);
    }

    this.form = new FormGroup({
      status: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      leaderName: new FormControl(null, Validators.required),
      content: new FormArray([]),
    });

    this.listOfData = this.program.getPtograms();

    this.subscription = this.program.programsList.subscribe((list) => {
      this.listOfData = this.indexGenerator(list);
      console.log(this.listOfData);
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

  addContent() {
    (<FormArray>this.form.get('content')).push(
      new FormControl(null)
    );
  }

  onDeleteContent(index: number) {
    (<FormArray>this.form.get('content')).removeAt(index);
  }

  onSubmit() {
    if (this.form.value.status) {
      for (const key in this.form.controls) {
        if (this.form.controls.hasOwnProperty(key)) {
          this.form.controls[key].markAsDirty();
          this.form.controls[key].updateValueAndValidity();
        }
      }
      // for (const key in this.form.controls.content['controls']) {
      //   if (this.form.controls.content['controls'].hasOwnProperty(key)) {
      //     this.form.controls.content['controls'][key].markAsDirty();
      //     this.form.controls.content['controls'][key].updateValueAndValidity();
      //   }
      // }
    } else {
      this.form.controls.status.markAsDirty();
      this.form.controls.status.updateValueAndValidity();
    }

    if (
      this.form.valid ||
      (this.form.value.status !== null && this.form.value.status !== true)
    ) {
      if (this.form.value.status !== null && this.form.value.status !== true) {
        this.form.patchValue({
          type: null,
          leaderName: null,
          content: []
        });
      }

      this.listOfData[this.index].song = this.form.value;
      this.program.updateProgram(this.listOfData[this.index], this.listOfData[this.index].key).then(() => {
        this.form.reset();
        this.addingMode = false;
        this.editMode = false;
        this.index = null;
      });
      // this.form.reset();
      // this.editMode = false;
    }
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
    this.addingMode = true;
    this.index = index;
  }

  enableEditing(index: number) {
    this.editMode = true;
    this.index = index;
    const programDetail = this.listOfData[index].song;
    if (programDetail.status) {
      this.form.patchValue({
        status: programDetail.status,
        type: programDetail.type,
        leaderName: programDetail.leaderName
      })
      for (const content of programDetail.content) {
        this.form.controls.content['controls'].push(new FormControl(content))
      }
    } else {
          this.form.patchValue({
            status: programDetail.status,
          });
        }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
