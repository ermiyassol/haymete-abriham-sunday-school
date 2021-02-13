import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksStoreComponent } from './main/liberary/books-store/books-store.component';
import { BorrowReturnComponent } from './main/liberary/borrow-return/borrow-return.component';
import { LiberaryComponent } from './main/liberary/liberary.component';
import { StaticDataComponent } from './main/liberary/static-data/static-data.component';
import { MainComponent } from './main/main.component';
import { MessageCheckmarkComponent } from './main/message-checkmark/message-checkmark.component';
import { MezmurCheckmarkComponent } from './main/mezmur-checkmark/mezmur-checkmark.component';
import { ProgramsComponent } from './main/programs/programs.component';
import { SettingComponent } from './main/setting/setting.component';
import { StatisticComponent } from './main/statistic/statistic.component';
import { StudEditNewDetailComponent } from './main/stud-edit-new-detail/stud-edit-new-detail.component';
import { StudentAttendanceComponent } from './main/student-attendance/student-attendance.component';
import { StudentListComponent } from './main/student-list/student-list.component';
import { StudentParticipationComponent } from './main/student-participation/student-participation.component';
import { TeacherAttendanceComponent } from './main/teacher-attendance/teacher-attendance.component';
import { UsersComponent } from './main/users/users.component';
import { ResolverService } from './services/resolver.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/መግቢያ' },
  { path: 'መግቢያ', component: HomeComponent },
  { path: 'ቤተ_መጽሐፍት', pathMatch: 'full', redirectTo: '/ቤተ_መጽሐፍት/መጽሐፍት_መፈለጊያ' },
  { path: 'ቤተ_መጽሐፍት/መጽሐፍት_መፈለጊያ', component: BooksStoreComponent },
  {
    path: 'ሰንበት_ት/ቤት',
    component: MainComponent,

    children: [
      { path: '', pathMatch: 'full', redirectTo: 'አጠቃላይ_መረጃ' },
      {
        path: 'አጠቃላይ_መረጃ',
        component: StatisticComponent,
      },
      {
        path: ':id/አባላት/መረጃ',

        component: StudEditNewDetailComponent,
      },
      {
        path: ':id/አባላት/መረጃ_ማደሻ',
        component: StudEditNewDetailComponent,
      },
      {
        path: 'አዲስ_አባል_መመዝገቢያ',
        component: StudEditNewDetailComponent,
      },
      {
        path: 'የአባላት_ዝርዝር',

        component: StudentListComponent,
      },
      {
        path: 'አባላት/ቀሪ_መቆጣጠሪያ',
        component: StudentAttendanceComponent,
      },
      {
        path: 'አባላት/ተሳትፎ',
        component: StudentParticipationComponent,
      },
      {
        path: 'ትምህርት/መምህር_መቆጣጠሪያ',
        component: TeacherAttendanceComponent,
      },
      {
        path: 'መዝሙር/መዝሙር_መቆጣጠሪያ',
        component: MezmurCheckmarkComponent,
      },
      {
        path: 'መርሀግብር',
        component: ProgramsComponent,
      },
      {
        path: 'ጉባኤ/መልዕክት_መቆጣጠሪያ',
        component: MessageCheckmarkComponent,
      },
      {
        path: 'ቤተ_መጽሐፍት',
        component: LiberaryComponent,
        children: [
          // { path: '', pathMatch: 'full', redirectTo: '/መግቢያ' },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'መረጃ'
          },
          {
            path: 'መረጃ',
            component: StaticDataComponent,
          },
          {
            path: 'መጽሐፍት_ቁጥጥር',
            component: BooksStoreComponent,
          },
          {
            path: 'መጽሐፍት_ኪራይ',
            component: BorrowReturnComponent,
          },
        ]
      },
      {
        path: 'ክፍላት',
        component: UsersComponent,
      },
      {
        path: 'መረጃ_ማስተካከያ',
        component: SettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
