import { UserService } from './../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: UserService) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  message = null;

  ngOnInit(): void {}

  submitForm(f) {
    if (f.valid) {
      this.auth
        .sendResetEmail(f.value.email)
        .then((res) => {
          this.message =
            'Password reset email sent successfully! Check your email.';
        })
        .catch((error) => {
          if (error) {
            switch (error.code) {
              case 'auth/invalid-email':
                this.email.setErrors({
                  INVALID_USER: 'The specified user account does not exist.',
                });
                break;
              case 'auth/user-not-found': {
                this.email.setErrors({
                  USER_NOT_FOUND:
                    'There is no user corresponding to the email address.',
                });
              }
              default:
                console.log('Error resetting password:', error);
            }
          }
        });
    }
  }

  get email() {
    return this.validateForm.controls['email'];
  }
}
