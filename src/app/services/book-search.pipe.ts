import { Pipe, PipeTransform } from '@angular/core';
import { Books } from '../models/book.model';

@Pipe({
  name: 'bookSearch'
})
export class BookSearchPipe implements PipeTransform {
  arr: Books[];
  transform(books: any, search: any): Books[] {
    if (search === '') {
    // console.log(search);
    return books;
    }
    if(search === 'true') {
      search = true;
    } else if (search === 'false') {
      search = false;
    } else {}
    this.arr = [];
    for (const student of books) {
      if (
        student.id === search ||
        student.status === search ||
        student.name.includes(search) ||
        student.type.includes(search)
      ) {
        this.arr.push(student);
      }
    }

    return this.arr;
  }

}
