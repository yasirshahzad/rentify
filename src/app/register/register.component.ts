import { UserService } from './../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../servicescustomvalidation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: UserService) {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  submitForm(f) {
    if (this.validateForm.valid) {
      console.log(f.value);
      this.auth
        .signUp(
          this.validateForm.value.userName,
          this.validateForm.value.password
        )
        .then((result) => {
          this.auth.sendVerificationMail();
          this.auth.save(result.user);
        })
        .catch((error) => {
          console.log(error);
          if (error.code == 'auth/email-already-in-use') {
            this.userName.setErrors({
              dupEmailError: 'Email already registered with an other account. ',
            });
          } else if (error.code == 'auth/invalid-email') {
            this.userName.setErrors({
              email: 'Email is invalid.',
            });
          } else if (error.code == 'auth/weak-password') {
            this.password.setErrors({
              weak:
                'Password is weak. It must have one special character, one uppercase and lowercase and one number. Length will be 8 characters minimum.',
            });
          }
        });
    } else {
      console.log('form error');
    }
  }

  get userName() {
    return this.validateForm.controls['userName'];
  }

  get password() {
    return this.validateForm.controls['password'];
  }
}
