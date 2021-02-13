import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Books } from 'src/app/models/book.model';
import { BookService } from '../../../services/books.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-books-store',
  templateUrl: './books-store.component.html',
  styleUrls: ['./books-store.component.css']
})

export class BooksStoreComponent implements OnInit, OnDestroy {
  listOfData: Books[] = [];
  form: FormGroup;
  book: Books;
  subscription: Subscription;
  editMode = false;
  index = null;
  search = '';
  accessControl = '';

  constructor(private bookService: BookService, private notification: NzNotificationService, private nzMessageService: NzMessageService) { }

  ngOnInit() {
    // access control checking
    this.accessControl = window.location.pathname === '/%E1%89%A4%E1%89%B0_%E1%88%98%E1%8C%BD%E1%88%90%E1%8D%8D%E1%89%B5/%E1%88%98%E1%8C%BD%E1%88%90%E1%8D%8D%E1%89%B5_%E1%88%98%E1%8D%88%E1%88%88%E1%8C%8A%E1%8B%AB' ? 'users' : '';

    if (this.accessControl === 'users') {
      this.bookService.setBooks();
    }

    this.listOfData = this.bookService.getBooks();

    this.subscription = this.bookService.booksList.subscribe(list => {
      this.listOfData = list;
      // console.log(this.listOfData);
    });

    this.form = new FormGroup({
      id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      status: new FormControl(true),
    });

    this.bookService.childChanged();
  }

  submitForm() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      this.form.patchValue({
        id: this.idGenerator(this.form.value.type, this.form.value.id)
      });
      if (this.editMode) {
        const key = this.listOfData[this.index].key;
        this.bookService.updateBook(this.form.value, key, this.index).then(() => {
          this.nzMessageService.info('የመጽሐፉ መረጃ ታድሷል');
          this.form.reset();
          this.index = null;
          this.editMode = false;
        });
      } else {
        // console.log(this.form.value)
        this.bookService.addBook(this.form.value)
        this.nzMessageService.info('አዲስ መጽሐፍ ገብቷል');
      }
      this.index = null;
      this.editMode = false;
      this.form.reset();
    }
  }

  viewLibraryBooks() {
    this.bookService.setBooks();
  }

  editBook(index) {
    this.index = index;
    this.editMode = true;
    const book = this.listOfData[index];
    if(book.status) {
      const bookCode = parseInt(book.id);
      this.form.setValue({
        id: bookCode,
        name: book.name,
        type: book.type,
        status: book.status
    });
    } else {
      this.index = null;
      this.editMode = false;
      this.notification.blank(
        'የመጽሐፍ መረጃ ማደስ',
        'አባላት የተዋሱትን መጽሐፍ መረጃ ማደስ አይቻልም!!\nመጽሀፉ ሲመለስ ማደስ ይችላሉ\nእናመሰኛለን።.',
        { nzDuration: 0 }
      );
    }
  }

  private idGenerator(type: string, id: number) {
    if (type === 'አጋዥ') {
      if (id < 10) {
        return '000' + id;
      } else if (id < 100) {
        return '00' + id;
      } else if (id < 1000) {
        return '0' + id;
      } else {
        return id;
      }
    }
    else if (type === 'ኮርስ') {
      if (id < 10) {
        return '00' + id;
      } else if (id < 100) {
        return '0' + id;
      } else {
        return id;
      }
    }
    else {
      return id.toString();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
