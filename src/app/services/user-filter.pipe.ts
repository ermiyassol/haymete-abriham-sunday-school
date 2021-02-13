import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../models/account.model';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  arr: Account[];
  transform(obj: Account[], role: string): Account[] {
    this.arr = [];
    if (role === 'ጽ/ቤት') {
      for (const data of obj) {
          if (data.role === 'መረጃ ማየት' || data.role === 'ትምህርት ክፍል' || data.role === 'መዝሙር ክፍል' || data.role === 'አባላት ጉዳይ') {
            this.arr.push(data);
          } else {}
        }
    } else if (role === 'ትምህርት ክፍል') {
      for (const data of obj) {
        if (data.role === 'ትምህርት ቁጥጥር' || data.role === 'ቤተ መጽሀፍት') {
          this.arr.push(data);
        }
      }
    } else if (role === 'አባላት ጉዳይ') {
      for (const data of obj) {
        if (data.role === 'መልዕክት ቁጥጥር' || data.role === 'አባላት ቁጥጥር' || data.role === 'መረጃ እና መዛግብት') {
          this.arr.push(data);
        }
      }
    } else {
      for (const data of obj) {
        if (data.role === 'መዝሙር ቁጥጥር') {
          this.arr.push(data);
        }
      }
    }
    return this.arr;
  }
}
