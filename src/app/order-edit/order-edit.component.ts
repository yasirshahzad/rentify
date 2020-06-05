import { CarService } from './../services/car.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Order, Extra } from './../shared/sharedModels';
import { switchMap } from 'rxjs/operators';
import { OrdersService } from './../service/orders.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent implements OnInit, OnDestroy {
  order: Order;
  loading = false;

  orderForm: FormGroup;
  orderSub: Subscription;
  locations$;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private carService: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      id: [''],
      orderDate: [''],
      carId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      status: [''],
      pickup: this.fb.group({
        date: [''],
        time: [''],
        location: [''],
      }),
      return: this.fb.group({
        date: [''],
        time: [''],
        location: [''],
      }),
      extras: this.fb.array([this.newExtras()]),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.locations$ = this.carService.getLocations();
    this.orderSub = this.route.paramMap
      .pipe(
        switchMap((param: ParamMap) => {
          return this.orderService.get(param.get('id'));
        })
      )
      .subscribe((x) => {
        this.order = x;
        this.orderForm.patchValue({
          id: x.key,
          orderDate: x.orderDate,
          carId: x.carId,
          userId: x.userId,
          status: x.approvalStatus,
          pickup: {
            location: x.pickup.location,
            time: x.pickup.time,
            date: x.pickup.date,
          },
          return: {
            location: x.return.location,
            time: x.return.time,
            date: x.return.date,
          },
        });

        this.orderForm.setControl('extras', this.setExistingExtras(x.extras));
        this.loading = false;
      });
  }

  //Get Extras Array
  get extras() {
    return this.orderForm.get('extras') as FormArray;
  }

  setExistingExtras(extras: Extra[]): FormArray {
    let array = new FormArray([]);

    extras.forEach((extra: Extra) => {
      array.push(
        this.fb.group({
          name: [extra.name, [Validators.required]],
          Price: [extra.Price, [Validators.required]],
        })
      );
    });

    return array;
  }

  //New Extras
  newExtras(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      Price: ['', Validators.required],
    });
  }

  addExtras() {
    this.extras.push(this.newExtras());
  }

  removeExtras(i: number) {
    this.extras.removeAt(i);
  }

  //Submitting Order Form
  submitOrderForm() {
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);
      this.orderService
        .updateOrder(this.orderForm.value, this.order.key)
        .then((result) => {
          this.router.navigate(['dashboard']);
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    }
  }
  //Unsubscribing Obervers here.
  ngOnDestroy(): void {
    this.orderSub.unsubscribe();
  }

  approve() {
    this.orderForm.controls['status'].setValue('approved');

    console.log(this.order.approvalStatus);
  }

  archive() {
    this.orderForm.controls['status'].setValue('archived');
    console.log(this.order.approvalStatus);
  }
}
