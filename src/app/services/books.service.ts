import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { Books } from '../models/book.model';


@Injectable({ providedIn: 'root' })
export class BookService {
  Books: Books[] = [];
  booksList = new Subject<Books[]>();
  property: string;

  constructor(private db: AngularFireDatabase) {}

  getBooks() {
    return this.Books.slice();
  }

  addBook(book) {
    return this.db.list('books').push(book).then(response => {
      book.key = response.key;
      this.Books.unshift(book);
      this.booksList.next(this.Books);
    });
  }

   childChanged () {
    const ref = this.db.database.ref('books');
    ref.on('child_changed', (snapshot) => {
      this.Books.forEach((cur, index) => {
        if(cur.key === snapshot.key) {
          this.Books[index] = snapshot.val();
          console.log('changed value called');
        }
      });
      this.booksList.next(this.Books);
    });
  }

  setBooks() {
    const ref = this.db.database.ref('books');
    ref.once('value', (snapshot) => {
      this.Books = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: Books;
          temp = snapshot.val()[key];
          temp.key = key;
          this.Books.push(temp);
        }
      }
      // this.Books.sort((b1, b2) => b1.type - b2.type);
      this.sort();
      // this.booksList.next(this.Books);
    });
  }

  updateBook(book: Books, key: string, index: number) {
    // this.Books[index] = book;
    // this.Books[index].key = key;
    // this.booksList.next(this.Books);
    return this.db.list('books').update(key, book);
  }

  sort() {
    let nameA;
    let nameB;
    this.Books.sort((a, b) => {
      nameA = a.id;
      nameB = b.id;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    this.booksList.next(this.Books.slice());
  }
}
