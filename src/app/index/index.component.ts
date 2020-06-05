import { CheckoutComponent } from './../checkout/checkout.component';
import { Car } from './../shared/sharedModels';
import { CarService } from './../services/car.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('pickupDate', { static: true }) pickupDate;
  selectedModel: string = 'all';
  cars: Car[];
  models;
  uniqueModelList;
  uniqueCityList$;

  loading: boolean = true;

  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;

  constructor(
    private carService: CarService,
    private modelService: CarService,
    private router: Router,
    private modal: NzModalService
  ) {}
  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    if (this.subscription4) {
      this.subscription4.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscription3 = this.carService.getCars().subscribe((list) => {
      this.cars = list;
      this.loading = false;
    });

    this.subscription2 = this.modelService.getCars().subscribe((cars: any) => {
      let modelss = cars.map((car) => car.brand);
      modelss = [...new Set(modelss)];
      this.models = modelss;
    });

    this.subscription1 = this.carService
      .getCars()
      .pipe(
        map((x) => x.map((y) => y.brand)),
        map((carList) => {
          return [...new Set(carList)];
        })
      )
      .subscribe((carNames) => {
        this.uniqueModelList = carNames;
      });

    this.uniqueCityList$ = this.modelService.getLocations();
  }

  filter(select: any) {
    this.loading = true;
    this.selectedModel = select.model;
    if (select.model === 'all') {
      this.subscription4 = this.carService.getCars().subscribe((list) => {
        this.cars = list;
        this.loading = false;
      });
    } else {
      this.subscription4 = this.carService
        .getCars()
        .pipe(
          map((list) => {
            let list1 = list.filter((car: Car) => {
              return (
                car.brand.toString().toLowerCase() ===
                (select.model as string).toLowerCase()
              );
            });

            return list1;
          })
        )
        .subscribe((cars) => {
          this.cars = cars;
          this.loading = false;
        });
    }

    this.loading = false;
  }

  route(f) {
    this.router.navigateByUrl('/fleet', { state: f.value });
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
