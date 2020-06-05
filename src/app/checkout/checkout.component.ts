import { OrdersService } from './../service/orders.service';
import { UserService } from './../services/login.service';
import { ModelService } from './../services/model.service';
import { CarService } from './../services/car.service';
import { Component, OnInit, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Car } from '../shared/sharedModels';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  validateForm: FormGroup;

  current = 0;
  uniqueCityList$: Observable<string[]>;

  @Input('car') car: Car;
  pickupLocation = '';
  returnLocation = '';
  pickUpDate = '';
  returnDate = '';
  pickupTime = '';
  returnTime = '';
  noDays;
  bill = 0;
  extras: any[] = [];

  order;
  user$: Observable<firebase.User>;

  error = false;
  constructor(
    private carService: CarService,
    private modelService: ModelService,
    public loginService: UserService,
    private orderService: OrdersService,
    private modal: NzModalRef,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.uniqueCityList$ = this.modelService.getModels().pipe(
      map((carList) => {
        return [...new Set([].concat(...carList.map((car) => car.locations)))];
      })
    );

    this.user$ = this.loginService.user$;
  }

  status = 'process';

  emptyError = {
    title: '',
    desc: '',
    error: false,
  };

  onIndexChange() {
    if (this.current == 0 && this.checkForErrors()) {
      this.status = 'error';
      this.emptyError = {
        error: true,
        title: 'There is an error(s)',
        desc: 'You have not filled all fields. Try again with correct values',
      };
    } else {
      this.emptyError.error = false;
      this.status = 'finihed';
      if (this.current < 2) this.current += 1;
      this.status = 'process';
    }
  }

  checkForErrors() {
    if (
      this.current === 0 &&
      (this.pickupLocation == '' ||
        this.returnLocation == '' ||
        this.pickupTime == '' ||
        this.returnTime == '' ||
        this.pickUpDate == '' ||
        this.returnDate == '')
    ) {
      return true;
    } else {
      if (this.noDays <= 0) {
        this.emptyError = {
          error: true,
          title: 'Date error',
          desc: 'Enter valid dates in pickup date and return date.',
        };

        return true;
      }
      return false;
    }
  }

  next() {
    if (this.current == 2) {
      this.current = 1;
    } else if (this.current == 1) {
      this.current = 0;
    }
  }
  changeExtra(extra) {
    let id = this.extras.findIndex((x) => x.id == extra.id);
    if (id == -1) {
      this.extras.push(extra);
    } else {
      this.extras.splice(id, 1);
    }

    this.calculateBill();
  }

  calculateDays() {
    if (this.pickUpDate == '' || this.returnDate == '') return;

    var t2 = new Date(this.returnDate).getTime();
    var t1 = new Date(this.pickUpDate).getTime();

    this.noDays = (t2 - t1) / (24 * 3600 * 1000);

    this.calculateBill();
  }
  calculateBill() {
    if (this.noDays === 1) {
      this.bill = this.car.price;
      return;
    }

    this.car.prices.map((x) => {
      if (this.noDays > x.days) {
        this.bill = this.noDays * x.price;
      }
    });

    let bill = 0;

    this.extras.map((extra) => {
      bill += extra.Price;
    });

    this.bill = this.bill + bill;
  }

  timenow() {
    var now = new Date(),
      ampm = 'AM',
      h = now.getHours(),
      m = now.getMinutes(),
      s = now.getSeconds();
    if (h >= 12) {
      if (h > 12) h -= 12;
      ampm = 'PM';
    }

    if (m < 10) m = 0 + m;
    if (s < 10) s = 0 + s;
    return now.toLocaleDateString() + ' ' + h + ':' + m + ':' + s + ' ' + ampm;
  }

  loginError: boolean = false;

  placeOrder() {
    if (this.current !== 2) {
      return;
    }

    this.user$
      .pipe(
        switchMap((user) => {
          if (user) {
            return this.orderService.createOrder({
              orderDate: this.timenow(),
              userId: user.uid,
              carId: this.car.id,
              pickup: {
                time: this.pickupTime,
                date: this.pickUpDate,
                location: this.pickupLocation,
              },
              return: {
                time: this.returnTime,
                date: this.returnDate,
                location: this.returnLocation,
              },
              extras: this.extras,
            });
          } else {
            this.loginError = true;
          }
        })
      )
      .subscribe((ref) => {
        ref.on('value', (snapshotChanges) => {
          this.order = { ...snapshotChanges.val(), id: snapshotChanges.key };
        });
      });
  }

  moveToFleet() {
    this.modal.destroy();
    this.router.navigateByUrl('/fleet');
  }

  moveToConsole() {
    this.modal.destroy();
    this.router.navigateByUrl('/admin/orders');
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
