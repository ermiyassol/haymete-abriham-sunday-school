import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Books } from 'src/app/models/book.model';
import { Library } from 'src/app/models/library_system.model';
import { LibraryService } from 'src/app/services/library.service';
import { Account } from '../../..//models/account.model';
import { AccountService } from '../../../services/acccount.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-borrow-return',
  templateUrl: './borrow-return.component.html',
  styleUrls: ['./borrow-return.component.css']
})
export class BorrowReturnComponent implements OnInit, OnDestroy {
  form: FormGroup;
  searchingBook = false;
  bookProperty: Books = null;
  subscription: Subscription;
  timeout: any;
  codeErrorMessage = false;
  listOfData: Library[] = null;
  listOfData1: Library[] = null;
  User: Account = {role: null, status: null, uid: null, username: null}
  

  constructor(private library: LibraryService, private account: AccountService, private nzMessageService: NzMessageService) {}

  ngOnInit(): void {
    this.account.accInfo.subscribe(response => {
      console.log(response);
      if (response) {this.User = response}
    });
    this.account.getAccountInfo();
    
    this.form = new FormGroup({
      bookCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      borrower: new FormControl(null, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
    });

    this.generateBookProperty();

    this.subscription = this.library.bookProperty.subscribe(response => {
      this.searchingBook = false;
      this.codeErrorMessage = false;
      this.bookProperty = response;
    });

    this.library.borrowList.subscribe(response => {
      this.listOfData = response;
    });

    this.library.returnList.subscribe(response => {
      this.listOfData1 = response.reverse();
    });
  }

  onSubmit() {
    if (this.form.valid && this.bookProperty) {
      // console.log(this.bookProperty);
      const userName = this.form.value.borrower;
      const bookCode = this.form.value.bookCode;
      const phone = this.form.value.phone;
      const date = this.dateGenerator();
      const LName1 = this.User.username;
      const name = this.bookProperty.name;
      const libraryForm = new Library( userName, bookCode, name, phone, date, false, LName1, '', [], null );
      console.log(libraryForm);

      this.library.addBorrow(libraryForm);
      this.nzMessageService.info(userName + " > " + name + 'ተውሷል');
      this.codeErrorMessage = false;
      this.bookProperty = null;
      this.form.reset();
    } else {
      this.codeErrorMessage = true;
      this.form.controls.borrower.markAsDirty();
      this.form.controls.borrower.updateValueAndValidity();
      this.form.controls.phone.markAsDirty();
      this.form.controls.phone.updateValueAndValidity();
    }
  }

  generateBookProperty() {
    this.subscription = this.form.controls.bookCode.valueChanges.subscribe(value => {
      this.codeErrorMessage = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      if (value) {
        this.searchingBook = true;
        this.timeout = setTimeout(() => {
        this.library.getBookName(value);
      }, 2000);

        setTimeout(() => {
          if (!this.bookProperty) {
            this.searchingBook = false;
            this.bookProperty = null;
            this.codeErrorMessage = true;
        }
      }, 7000);
      } else {
        this.bookProperty = null;
        this.searchingBook = false;
        this.codeErrorMessage = false;
        clearTimeout(this.timeout);
      }
    });
  }

  // editInfo(index: number, key: string) {}

  viewLibraryInfo() {
    this.library.setBorrow();
  }

  viewAllInfo() {
    this.library.setReturn();
  }

  submitReturned() {
    const date = this.dateGenerator();
    this.listOfData.forEach((cur, index) => {
      if (cur.status) {
        cur.date = cur.date.concat(' - ', date);
        cur.LName2 = this.User.username;
        this.library.updateBorrow(cur, index, cur.key);
        this.nzMessageService.info('መጽሐፉ ተመልሷል');
        // console.log(cur);
        // this.listOfData.splice(index, 1);
        // this.listOfData1.unshift(cur);
      }
    });
  }

  private dateGenerator() {
    return new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear();
  }

  updateInfo(index: number) {
    const date = this.dateGenerator();
    this.listOfData[index].update.push(date);
    this.library.updateBorrow(this.listOfData[index], index, this.listOfData[index].key);
    this.nzMessageService.info('መጽሐፍት ውሰቱ በትክክል ታድሷል');
  }

  deleteInfo(index) {
    const key = this.listOfData1[index].key;
    this.library.deleteReturn(key, index);
    this.nzMessageService.info('መጽሐፍት ውሰት ታሪኩ ጠፍቷል');
    // this.listOfData1.splice(index, 1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
