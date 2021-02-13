import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account.model';
import { User } from '../models/auth.model';

export interface authResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  passwordHash?: string;
  providerUserInfo?: any;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  Accounts: Account[] = [];
  accountInfo: Account;
  accInfo = new Subject<Account>();
  accountsList = new Subject<Account[]>();
  errorMessage = new Subject<string>();
  user = new BehaviorSubject<User>(null);
  expirationTimer: any;

  constructor(private http: HttpClient, private db: AngularFireDatabase, private route: Router) {}

  signup(info: Account) {
    console.log(info);
    return this.http.post<authResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebase.apiKey, {
      email: info.email,
      password: info.password,
      returnSecureToken: true,
    }).pipe(catchError(this.handleError),
    tap(res => {
      this.db.list('users').push({uid: res.localId, username: info.username, role: info.role, status: info.status});
    })
    );
  }

  login(account: { email: string; password: string }) {
    return this.http
      .post<authResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebase.apiKey,
        {
          email: account.email,
          password: account.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          // this.db.database.ref('users').orderByChild('uid').equalTo(res.localId).once('value', snapshot => {
          //   for (const key in snapshot.val()) {
          //     if (snapshot.val().hasOwnProperty(key)) {
          //       this.accountInfo = snapshot.val()[key];
          //       if(this.accountInfo.status) {
          //         this.handleAuthentication( res.email, res.localId, res.idToken, +res.expiresIn);
          //         this.errorMessage.next('');
          //       } else {
          //         this.errorMessage.next('አካውንትዎ ልጊዜው ታግዷል አለቃዎን ያነጋግሩ!!');
          //       }
          //     }
          //   }
          // });
          this.retriveUserData(res.localId).then(() => {
            if (this.accountInfo.status) {
              this.handleAuthentication( res.email, res.localId, res.idToken, +res.expiresIn);
              this.errorMessage.next('');
            } else {
              this.errorMessage.next('አካውንትዎ ልጊዜው ታግዷል አለቃዎን ያነጋግሩ!!');
            }
          });
        })
      );
  }

  changePassword(pass: string) {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokentExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));
    return this.http.post<authResponse>('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + environment.firebase.apiKey, {
      idToken: userData._token,
      password: pass,
      returnSecureToken: true,
    }).pipe(tap (res => {
      this.handleAuthentication( res.email, res.localId, res.idToken, +res.expiresIn);
    }));
  }

  retriveUserData(uid: string) {
    return this.db.database.ref('users').orderByChild('uid').equalTo(uid).once('value', snapshot => {
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          this.accountInfo = snapshot.val()[key];
          this.accInfo.next(this.accountInfo);
        }
      }
    });
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(expiresIn * 1000);
    this.user.next(user);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokentExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const user = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokentExpirationDate)
    );

    if (user.Token) {
      this.retriveUserData(userData.id);
      const expirationTime =
        new Date(userData._tokentExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationTime);
      this.user.next(user);
    }
  }

  logout() {
    this.user.next(null);
    this.route.navigate(['/መግቢያ']);
    localStorage.removeItem('userData');
    clearTimeout(this.expirationTimer);
    this.expirationTimer = null;
  }

  autoLogout(expirationTime: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  getAccounts() {
    this.db.database.ref('users').on('value', snapshot => {
      this.Accounts = [];
      for (const key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          let temp: Account;
          temp = snapshot.val()[key];
          temp.key = key;
          this.Accounts.push(temp);
        }
      }
      this.accountsList.next(this.Accounts);
    });
  }

  getAccountInfo() {
    this.accInfo.next(this.accountInfo);
  }

  private handleError(error: HttpErrorResponse) {

      let errorMessage = 'ERROR: በድጋሚ ያስገቡ!!';
      if (error.error) {
        switch (error.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'ERROR: ያስገቡት ኢሜል በሌላ ሰው ተመዝግቦ ይገኛል እና ቀይረው ያስገቡ!!';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'ERROR: ያስገቡት ኢሜል አልተመዘገበም ጸጋዬን ደውለው ያነጋግሩት!!';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'ERROR: ፓስወርድ ተሳስተዋል በድጋሚ ይሞክሩ!!';
            break;
          default:
            errorMessage = error.error.error.message;
            break;
        }
        return throwError(errorMessage);
      }
      return throwError(errorMessage);
  }

  updateAccount(account: Account) {
    const key = account.key;
    account.key = null;
    return this.db.list('users').update(key, account);
  }
}