import { NzModalService } from 'ng-zorro-antd/modal';
import { Car } from './../shared/sharedModels';
import { CarService } from './../services/car.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-singl-car',
  templateUrl: './singl-car.component.html',
  styleUrls: ['./singl-car.component.css'],
})
export class SingleCarComponent implements OnInit {
  car$: Observable<Car>;

  constructor(
    private route: ActivatedRoute,
    private modal: NzModalService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.car$ = this.route.paramMap.pipe(
      switchMap((params) => {
        let carId = params.get('id');
        return this.carService.getCar(carId);
      })
    );
  }

  checkout(car: Car) {
    let modal = this.modal.create({
      nzTitle: `Booking ${car.model}`,
      nzContent: CheckoutComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        car: car,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Previvous',
          type: 'default',
          onClick: (componentInstance) => {
            componentInstance.next();
          },
        },
        {
          label: 'Next',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.onIndexChange();
          },
        },
        {
          label: 'Place Order',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.placeOrder();
          },
        },
      ],
      nzWidth: 1200,
      nzMaskClosable: false,
      nzCloseOnNavigation: false,
    });

    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal.afterClose.subscribe((result) =>
      console.log('[afterClose] The result is:', result)
    );

    // delay until modal instance created
    setTimeout(() => {
      // instance.subtitle = 'sub title is changed';
    }, 2000);
  }
}
