import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  constructor() {}

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(
        '((+*)((0[ -]+)*|(92 )*)(d{12}+|d{10}+))|d{5}([- ]*)d{6}'
      );
      const valid = regex.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }

  static password(control: AbstractControl): ValidationErrors | null {
    return new Promise((resolve, reject) => {
      const regex = new RegExp(
        '(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
      );
      const valid = regex.test(control.value);
      if (!valid) {
        return {
          weak:
            'Password is weak. It must have one special character, one uppercase and lowercase and one number. Length will be 8 characters minimum.',
        };
      } else {
        return null;
      }
    });
  }
}
