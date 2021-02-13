import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { AntDesignImports } from './ant-design-imports';
import { IconsProviderModule } from './icons-provider.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { StudEditNewDetailComponent } from './main/stud-edit-new-detail/stud-edit-new-detail.component';
import { StatisticComponent } from './main/statistic/statistic.component';
import { StudentListComponent } from './main/student-list/student-list.component';
import { AgeCalculatorPipe } from './services/age-calculator.pipe';
import { SearchEnginPipe } from './services/search-engin.pipe';
import { environment } from '../environments/environment';
import { StudentAttendanceComponent } from './main/student-attendance/student-attendance.component';
import { TeacherAttendanceComponent } from './main/teacher-attendance/teacher-attendance.component';
import { MezmurCheckmarkComponent } from './main/mezmur-checkmark/mezmur-checkmark.component';
import { ProgramsComponent } from './main/programs/programs.component';
import { MessageCheckmarkComponent } from './main/message-checkmark/message-checkmark.component';
import { LiberaryComponent } from './main/liberary/liberary.component';
import { BooksStoreComponent } from './main/liberary/books-store/books-store.component';
import { BorrowReturnComponent } from './main/liberary/borrow-return/borrow-return.component';
import { BookSearchPipe } from './services/book-search.pipe';
import { StaticDataComponent } from './main/liberary/static-data/static-data.component';
import { UsersComponent } from './main/users/users.component';
import { StudentParticipationComponent } from './main/student-participation/student-participation.component';
import { AttendanceFilterPipe } from './services/attendance-filter.pipe';
import { SettingComponent } from './main/setting/setting.component';
import { UserFilterPipe } from './services/user-filter.pipe';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    StudEditNewDetailComponent,
    StatisticComponent,
    StudentListComponent,
    AgeCalculatorPipe,
    SearchEnginPipe,
    StudentAttendanceComponent,
    TeacherAttendanceComponent,
    MezmurCheckmarkComponent,
    ProgramsComponent,
    MessageCheckmarkComponent,
    LiberaryComponent,
    BooksStoreComponent,
    BorrowReturnComponent,
    BookSearchPipe,
    StaticDataComponent,
    UsersComponent,
    StudentParticipationComponent,
    AttendanceFilterPipe,
    SettingComponent,
    UserFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AntDesignImports,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
