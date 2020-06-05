import { UserService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: UserService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
  submitForm(f): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (!this.validateForm.valid) {
      return;
    }
    this.loginService
      .login(f.value.userName, f.value.password)
      .then((resp) => {
        console.log('Success', resp);
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/invalid-email': {
            this.userName.setErrors({
              INVALID_EMAIL: 'Email address is not valid.',
            });
            break;
          }
          case 'auth/user-disabled': {
            this.validateForm.setErrors({
              USER_DISABLED:
                'User corresponding to the given email has been disabled.',
            });
            break;
          }
          case 'auth/user-not-found': {
            this.validateForm.setErrors({
              USER_NOT_FOUND:
                'There is no user corresponding to the given email.',
            });
            break;
          }
          case 'auth/wrong-password': {
            this.password.setErrors({
              WRONG_PASSWORD:
                'The password is invalid for the given email, or the account corresponding to the email does not have a password set.',
            });
            break;
          }
          default:
            console.log('Error logining:', err);
        }
      });
  }

  otherLogin(type: string) {
    this.loginService.otherLogin(type);
  }

  get userName() {
    return this.validateForm.controls['userName'];
  }

  get password() {
    return this.validateForm.controls['password'];
  }
}
