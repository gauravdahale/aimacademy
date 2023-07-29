import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LogService} from "../services/log.service";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  changePassword = false
// regArray:any={}
  changePasswordForm!:FormGroup
  loginForm!: FormGroup;
  type: string = "password";
  isText: Boolean = false;
  eyeIcon: string = "fa-eye-slash";


  constructor(private router: Router,
              private _matSnackbar:MatSnackBar,
              private logService:LogService,
              private authService: AuthService) {
    // localStorage.clear()
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    })
    this.changePasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })

  }


  loginUser() {
    console.log(this.loginForm.value)

    this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password'])
  }

  get username() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  hideshowpass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = " fa fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  logout() {
    this.authService.SignOut();
    console.log(this.loginForm)
  }

  forgotPassword() {

    this.changePassword = true

  }
  submitForgotPassword(email:string){

    this.authService.changePassword(email)
    this._matSnackbar.open(`A verification email has been sent to ${email} `,'EMAIL SENT')._dismissAfter(4000)
  }
}
