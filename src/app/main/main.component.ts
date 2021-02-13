import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account.model';
import { AccountService } from '../services/acccount.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})

export class MainComponent implements OnInit {
  User: Account = {role: null, status: null, uid: null, username: null}
  greeting = true;
  constructor(private account: AccountService, private nzMessageService: NzMessageService) {}

  ngOnInit(): void {
      this.account.accInfo.subscribe(response => {
        if (response) {
          this.User = response
          if(this.greeting) {
            this.nzMessageService.info(this.User.username.split(' ')[0] + ' እንኳን ደና መጣህ');
            this.greeting = false;
          }
        }
      });
      this.account.getAccountInfo();
  }
  //! መረጃ ማየት
  //! ጽ/ቤት
  //! ትምህርት ክፍል
  //! መዝሙር ክፍል
  //! አባላት ጉዳይ
  //! ትምህርት ቁጥጥር
  //! ቤተ መጽሀፍት
  //! መዝሙር ቁጥጥር
  //! መልዕክት ቁጥጥር
  //! አባላት ቁጥጥር
  //! መረጃ እና መዛግብት
  onLogout() {
    this.account.logout();
  }
}
