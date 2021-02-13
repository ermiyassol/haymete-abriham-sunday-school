import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Programs } from 'src/app/models/programs.model';
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-teacher-attendance',
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit, OnDestroy {
  form: FormGroup;
  expandSet = new Set<number>();
  listOfData = [];
  subscription: Subscription;
  addingMode = false;
  editMode = false;
  index = null;
  Courses = ['የጉባኤ ትምህርት', 'ትምህርተ ሃይማኖት', 'ክርስቲያናዊ ሥነ-ምግባር', 'የመጽሐፍ ቅዱስ ጥናት', 'የቤ/ክ/ን ታሪክ በአለም መድረክ', 'ነገረ ማርያም', 'ሥርዓተ ትምህርት', 'የቤ/ክ/ን ታሪክ በኢትዮጵያ', 'ነገረ ቅዱሳን', 'ልሳነ ግዕዝ', 'የመዝሙር ት/ት', 'ሐዋርያዊ ተልዕኮ', '7ቱ ምስጢራተ ቤ/ክ/ን', '5ቱ አዕማደ ምስጢር', 'ኦጾት', 'ወጣትነትና መንፈሳዊ አገልግሎት', 'የአብነት ትምህርት', 'ሥርዓተ ቅዳሴ ተሰጥኦ'];

  constructor(private program: ProgramsService) {}

  ngOnInit(): void {

    if (this.program.Programs.length === 0) {
      this.program.setPrograms(7);
    }

    this.form = new FormGroup({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      duration: new FormControl(null),
      status: new FormControl(null, Validators.required),
      courseName: new FormControl(null, Validators.required),
      teacherName: new FormControl(null, Validators.required),
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
    } else {
      this.form.controls.status.markAsDirty();
      this.form.controls.status.updateValueAndValidity();
    }

    if (
      this.form.valid ||
      (this.form.value.status !== null && this.form.value.status !== true)
    ) {
      if (this.form.value.status) {
        this.form.value.duration = this.hourConverter(this.form.value.start) + ' - ' + this.hourConverter(this.form.value.end);
      } else {
        this.form.patchValue({
          duration: null,
          start: null,
          end: null,
          courseName: null,
          teacherName: null,
          content: [],
        });
      }

      this.listOfData[this.index].lecture = this.form.value;
      this.program.updateProgram(this.listOfData[this.index], this.listOfData[this.index].key).then(() => {
        this.form.reset();
        this.addingMode = false;
        this.editMode = false;
        this.index = null;
      });
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
    const programDetail = this.listOfData[index].lecture;
    if (programDetail.status) {
      this.form.patchValue({
        status: programDetail.status,
        courseName: programDetail.courseName,
        teacherName: programDetail.teacherName,
        start: programDetail.start,
        end: programDetail.end,
      })

      for (const content of programDetail.content) {
        this.form.controls.content['controls'].push(new FormControl(content));
      }
    } else {
      this.form.patchValue({
        status: programDetail.status,
      });
    }
  }

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
