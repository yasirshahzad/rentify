import { FavService } from './../services/fav.service';
import { CompareService } from './../services/compare.service';
import { ModelService } from './../services/model.service';
import { Car } from './../shared/sharedModels';
import { Observable, Subscription } from 'rxjs';
import { CarService } from './../services/car.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutComponent } from '../checkout/checkout.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css'],
})
export class FleetComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  sortByProp;
  noOfCars;
  cars$: Observable<Car[]>;
  models;
  brand = '';
  year = '';
  fuelType = '';
  transmission = '';
  bodyStyle = '';
  color = '';
  priceRange;
  marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
  };

  searchCity = '';
  uniqueCityList$;
  subscription: Subscription;
  constructor(
    private carService: CarService,
    private modelService: ModelService,
    private compareService: CompareService,
    private notification: NzNotificationService,
    private favService: FavService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modal: NzModalService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.cars$ = this.carService.getCars();

    this.subscription = this.modelService.getModels().subscribe((cars: any) => {
      let modelss = cars.map((car) => car.brand);
      modelss = [...new Set(modelss)];
      this.models = modelss;
    });

    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((x) => {
        console.log(x);

        if (x.model) {
          this.brand = x.model;
          this.brandFilter();
        }

        if (x.city) {
          console.log(x.make);
          this.searchCity = x.city;
          this.cityFilter();
        }
      });

    this.uniqueCityList$ = this.modelService.getModels().pipe(
      map((carList) => {
        return [...new Set([].concat(...carList.map((car) => car.locations)))];
      })
    );
  }

  reset() {
    this.color = this.bodyStyle = this.transmission = this.brand = this.year = this.fuelType = this.searchCity =
      '';

    this.cars$ = this.carService.getCars();
  }

  limit() {
    this.cars$ = this.cars$.pipe(map((cars) => cars.slice(0, this.noOfCars)));
  }

  sortBy() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.sort((a, b) => a[this.sortByProp] - b[this.sortByProp])
      )
    );
  }

  limitCars() {
    this.cars$ = this.carService.getCars();
  }

  brandFilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.filter(
          (car) =>
            car.brand.toLowerCase().indexOf(this.brand.toLowerCase()) !== -1
        )
      )
    );
  }

  yearFilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) => cars.filter((car) => car.year.indexOf(this.year) !== -1))
    );
  }

  fuelFilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.filter(
          (car) =>
            car.fuelType.toLowerCase().indexOf(this.fuelType.toLowerCase()) !==
            -1
        )
      )
    );
  }

  transmissionfilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.filter(
          (car) =>
            car.transmission
              .toLowerCase()
              .indexOf(this.transmission.toLowerCase()) !== -1
        )
      )
    );
  }

  bodyFilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.filter(
          (car) =>
            car.bodyStyle
              .toLowerCase()
              .indexOf(this.bodyStyle.toLowerCase()) !== -1
        )
      )
    );
  }

  colorFilter() {
    this.cars$ = this.cars$.pipe(
      map((cars) =>
        cars.filter(
          (car) =>
            car.exteriorColor
              .toLowerCase()
              .indexOf(this.color.toLowerCase()) !== -1
        )
      )
    );
  }

  priceRanteFilter() {
    if (this.priceRange.length != 0) {
      this.cars$ = this.cars$.pipe(
        map((cars) =>
          cars.filter(
            (car) =>
              car.price > this.priceRange[0] && car.price <= this.priceRange[1]
          )
        )
      );
    }
  }

  addOrRemoveToCompare(car: Car) {
    if (this.compareService.doCarExists(car)) {
      this.compareService
        .removeCar(car)
        .pipe(take(1))
        .subscribe(
          (messaage) => {
            this.notification.create(
              'warning',
              `${car.model} has been removed from list.`,
              'This car has been removed from list. You can add again or add more.',
              { nzPlacement: 'bottomLeft' }
            );
          },
          (error) => {
            this.notification.create(
              'error',
              `There is problem in removing ${car.model}.`,
              error,
              { nzPlacement: 'bottomLeft' }
            );
          }
        );
    } else {
      this.compareService
        .addToCompare(car)
        .pipe(take(1))
        .subscribe(
          (messaage) => {
            this.notification.create(
              'success',
              `${car.model} has been added.`,
              'This vehicle has been been added to comparison list. You can view list from top right comparison icon.',
              { nzPlacement: 'bottomLeft' }
            );
          },
          (error) => {
            this.notification.create(
              'error',
              `There is problem in adding ${car.model}.`,
              error,
              { nzPlacement: 'bottomLeft' }
            );
          }
        );
    }
  }

  checkForCompareExistence(car: Car) {
    return this.compareService.doCarExists(car);
  }

  doFav(car: Car) {
    this.favService.doFav(car);
  }

  doOrUndoFav(car: Car) {
    if (this.checkForFavExistence(car)) {
      this.favService.doUnFav(car);
    } else {
      this.favService.doFav(car);
    }
  }

  checkForFavExistence(car: Car) {
    return this.favService.checkForFavExistence(car);
  }

  cityFilter() {
    this.cars$ = this.cars$.pipe(
      map((carsList) => {
        return carsList.filter((car) => {
          if (this.searchCity == '') return true;
          else {
            if (car.locations.indexOf(this.searchCity) != -1) return true;
          }
        });
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
