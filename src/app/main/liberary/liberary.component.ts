import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/acccount.service';
import { Account } from '../../models/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liberary',
  templateUrl: './liberary.component.html',
  styleUrls: ['./liberary.component.css']
})
export class LiberaryComponent implements OnInit {
  User: Account = {role: null, status: null, uid: null, username: null}
  constructor(private account: AccountService, private route: Router) {}

  ngOnInit(): void {
      this.account.accInfo.subscribe(response => {
        console.log(response);
        if (response) {
          this.User = response
        }
      });
        this.account.getAccountInfo();
  }
}
