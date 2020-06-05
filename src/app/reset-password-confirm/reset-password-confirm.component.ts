import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../services/login.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css'],
})
export class ResetPasswordConfirmComponent implements OnInit {
  mode: string = null;
  oobCode: string = null;
  message: { error?: boolean; message?: string } = { error: false };

  confirmPasswordResetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private auth: UserService,
    private fb: FormBuilder
  ) {
    this.confirmPasswordResetForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
          ),
        ],
      ],
    });
  }

  realAuth = firebase.auth();

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((param: ParamMap) => {
      this.mode = param.get('mode');
      this.oobCode = param.get('oobCode');

      if (this.mode == 'verifyEmail') {
        this.applyCode();
        console.log('hellow from here');
      }
    });
  }

  //Recovering email
  recoverEmail() {
    let restoredEmail = null;

    this.realAuth
      .checkActionCode(this.oobCode)
      .then((info) => {
        // Get the restored email address.
        restoredEmail = info['data']['email'];

        // Revert to the old email.
        return this.realAuth.applyActionCode(this.oobCode);
      })
      .then(function () {
        this.message.error = false;
        this.message.message = 'Email has been recovered';
      })
      .catch(function (error) {
        this.message.error = true;

        this.message.message = error.message;
      });
  }

  get newPassword() {
    return this.confirmPasswordResetForm.controls['newPassword'];
  }

  confirmPasswordResetFormSubmit(f) {
    if (this.confirmPasswordResetForm.valid && this.oobCode) {
      this.auth
        .confirmResetPassword(this.oobCode, f.value.newPassword)
        .then((res) => {
          this.message = {
            message: 'Password has been reset. Try sigining again.',
          };
        });
    }
  }

  applyCode() {
    this.auth
      .applyActionCode(this.oobCode)
      .then((res) => {
        this.auth.updateEmailVerificationStatus();
      })
      .catch((error) => {
        this.message.error = true;
        switch (error.code) {
          case 'auth/expired-action-code': {
            this.message.message =
              'Code has expired. Send again from admin pannel.';
            break;
          }
          case 'auth/invalid-action-code': {
            this.message.message =
              'Action code is invalid. This can happen if the code is malformed or has already been used.';
            break;
          }
          case 'auth/user-disabled': {
            this.message.message =
              'User corresponding to the given action code has been disabled.';
            break;
          }
          case 'auth/user-not-found': {
            this.message.message = error.message;
            break;
          }

          default:
            console.log('There is problem in verifying email.', error);
            break;
        }
      });
  }
}
