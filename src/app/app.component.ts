import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/acccount.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private account: AccountService) {}
  ngOnInit() {
    this.account.autoLogin();
  }
}
