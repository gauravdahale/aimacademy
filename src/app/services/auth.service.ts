import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FirebaseErrors} from "../FirebaseErrors";
import {LogService} from "./log.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userEmail = '';

  constructor(
      public mAuth: AngularFireAuth,
      public router: Router,
      private mLogService: LogService,
      private mDatabase: AngularFireDatabase,
      private  readonly _snackBar:MatSnackBar

  ) {
  }
  async SignIn(email: string, password: string) {
    localStorage.clear()
    try {
      const userCredential = await this.mAuth.signInWithEmailAndPassword(
          email,
          password
      ).catch(err=>{
        this._snackBar.open(err.message)._dismissAfter(3000)
        console.log('Something went wrong:', FirebaseErrors.Parse(err.message));
      });
      if (userCredential && userCredential.user) {
        console.log('Login Successfull')
        const user = userCredential.user;
        localStorage.setItem('aimuser', JSON.stringify(user));
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('userEmail', user.email!);
        this.userEmail = localStorage.getItem('userEmail')!;
        // let activity = {
        //   date: new Date().getTime(),
        //   section: 'Login',
        //   action: 'Login',
        //   user: this.userEmail,
        //   description: 'Login by user ' + this.userEmail,
        //   currentIp: localStorage.getItem('currentip')!,
        // };
        // await this.setUserData(user.uid)

        // await this.mLogService.addLog(activity);
        await this.router.navigate(['']);

      }

    } catch (err:any) {
      this._snackBar.open(err.message)._dismissAfter(3000)
      console.log('Something went wrong:', FirebaseErrors.Parse(err.message));
    }
  }

  async SignOut() {
    // let activity = {
    //   date: new Date().getTime(),
    //   section: 'Logout',
    //   action: 'Logout',
    //   description: 'Logout by user ',
    //   currentIp: localStorage.getItem('currentip')!,
    // };
    // await this.mLogService.addLog(activity);
    try {
      await this.mAuth.signOut();
      localStorage.clear();
      await this.router.navigate(['login']);
      console.log('Logged out!');
    } catch (err) {
      console.log('Error while signing out:', err);
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('aimuser')!);
    console.log('Logged in user details (isLoggedIn)', user);
    return user != null;
  }
  changePassword(email: string) {
    this.mAuth.sendPasswordResetEmail(email).then(r => this._snackBar.open('A password reset link has been sent to your email')._dismissAfter(3000));
  }
}
