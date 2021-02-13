import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageCalculator',
})
export class AgeCalculatorPipe implements PipeTransform {
  transform(value: string): unknown {
    // Tue Oct 06 2020 this is value format
    const age = new Date().getFullYear() - +value.substr(11, 4);
    return age;
  }
}
