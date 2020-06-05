import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Car } from './../shared/sharedModels';
import { CompareService } from './../services/compare.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  subscription: Subscription;
  constructor(
    private compareService: CompareService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.compareService.compareList$.subscribe(
      (cars) => (this.cars = cars)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeVehicle(car: Car) {
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
  }
}
