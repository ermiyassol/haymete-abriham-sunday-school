import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { Books } from '../models/book.model';
import { Library } from '../models/library_system.model';

@Injectable({providedIn: 'root'})
export class LibraryService {
  Borrow: Library[] = [];
  Return: Library[] = [];
  statistics = [];
  Book: Books;
  borrowList = new Subject<Library[]>();
  returnList = new Subject<Library[]>();
  staticList = new Subject<any[]>();
  bookProperty = new Subject<Books>();

  constructor(private db: AngularFireDatabase) {}
  ref = this.db.database.ref('library');
  bookRef = this.db.database.ref('books');

  getBorrowList() {
    return this.Borrow.slice();
  }

  addBorrow(library) {
    return this.db.list('library').push(library).then(response => {
      library.key = response.key;
      this.Borrow.unshift(library);
      this.borrowList.next(this.Borrow);
      const key = this.Book.key;
      this.Book.key = null;
      this.Book.status = false;
      this.db.list('books').update(key, this.Book);
      console.log(key);
    });
  }

  getBookName(id) {
    this.bookRef.orderByChild('id').equalTo(id).once('value', (snapshot) => {
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          this.Book = snapshot.val()[key];
          this.Book.key = key;
          this.bookProperty.next(this.Book);
        }
      }
    });
  }

  setBorrow() {
    this.ref.orderByChild('status').equalTo(false).once('value', (snapshot) => {
      this.Borrow = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: Library;
          temp = snapshot.val()[key];
          temp.key = key;
          temp.update = temp.update ? temp.update : [];
          this.Borrow.push(temp);
        }
      }
      this.borrowList.next(this.Borrow);
    });
  }

  setReturn() {
    this.ref.orderByChild('status').equalTo(true).limitToLast(100).once('value', (snapshot) => {
      this.Return = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: Library;
          temp = snapshot.val()[key];
          temp.key = key;
          temp.update = temp.update ? temp.update : [];
          this.Return.push(temp);
        }
      }
      this.returnList.next(this.Return);
    });
  }

  updateBookStatus(id: string) {
    this.bookRef.orderByChild('id').equalTo(id).once('value', (snapshot) => {
      for (const i in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(i)) {
          const book = snapshot.val()[i];
          book.status = true;
          const key = i;
          this.db.list('books').update(key, book);
          console.log(key);
        }
      }
    });
  }

  updateBorrow(borrow: Library, index: number, key: string) {
    if (borrow.status) {
      console.log('if');
      this.Borrow.splice(index, 1);
      this.Return.unshift(borrow);
      this.returnList.next(this.Return);
      this.updateBookStatus(borrow.bookCode);
    } else {
      console.log('else');
      this.Borrow[index] = borrow;
    }
    this.borrowList.next(this.Borrow);
    borrow.key = null;
    return this.db.list('library').update(key, borrow);
  }

  deleteReturn(key: string, index: number) {
    this.Return.splice(index, 1);
    this.returnList.next(this.Return);
    return this.db.list('library').remove(key);
  }

  getStastic() {
    this.statistics = [];
    // let temp: {name: string, value: number};
    this.bookRef.once("value")
  .then(snapshot => {
    const name = 'በቤተ መጽሀፍት የሚገኙ መጽሀፍት ብዛት';
    const value = snapshot.numChildren();
    this.statistics.unshift({type: name, value: value});

    const types = ['አጋዥ', 'ኮርስ', 'አስኳላ', 'መጽሔት', 'ጋዜጣ', 'ሌሎች'];

    for (const type of types) {
      this.bookRef.orderByChild('type').equalTo(type).once("value")
    .then(snapshot => {
      const name = 'የ' + type + ' መጽሐፍት ብዛት';
      const value = snapshot.numChildren();
      this.statistics.unshift({type: name, value: value});
      if (type === 'ሌሎች') {
        this.bookRef.orderByChild('status').equalTo(false).once("value")
        .then(snapshot => {
          const name = 'በውሰት አባላት ጋር የሚገኙ መጽሐፍት ብዛት';
          const value = snapshot.numChildren();
          this.statistics.unshift({type: name, value: value});
          this.staticList.next(this.statistics);
        });
      }
    });
  }
  });
  }
}
