import { Component, OnDestroy, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { Chart } from '@antv/g2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-static-data',
  templateUrl: './static-data.component.html',
  styleUrls: ['./static-data.component.css']
})
export class StaticDataComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private library: LibraryService) {}
  ngOnInit() {
    
    console.log('initialization called');
    this.library.getStastic();
    this.subscription = this.library.staticList.subscribe(response => {
      const data = response;
      const chart = new Chart({
          container: 'book_statics',
          autoFit: true,
          height: 400,
        });
      chart.data(data);
      chart.scale({
          value: {
            max: data[7].value + 3,
            min: 0,
            alias: 'ብዛት',
          },
        });
      chart.axis('type', {
          title: null,
          tickLine: null,
          line: null,
        });

      chart.axis('value', {
          label: null,
          title: {
            offset: 30,
            style: {
              fontSize: 12,
              fontWeight: 300,
            },
          },
        });
      chart.legend(false);
      chart.coordinate().transpose();
      chart
          .interval()
          .position('type*value')
          .size(26)
          .label('value', {
            style: {
              fill: '#8d8d8d',
            },
            offset: 10,
          });
      chart.interaction('element-active');
      chart.render();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}