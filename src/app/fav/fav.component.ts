import { FavService } from './../services/fav.service';
import { CompareService } from './../services/compare.service';
import { Component, OnInit } from '@angular/core';
import { Car } from '../shared/sharedModels';
import { take } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.component.html',
  styleUrls: ['./fav.component.css'],
})
export class FavComponent implements OnInit {
  cars$;

  constructor(
    private compareService: CompareService,
    private notification: NzNotificationService,
    private favService: FavService
  ) {}

  ngOnInit(): void {
    this.cars$ = this.favService.favList$;
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

  doOrUndoFav(car: Car) {
    if (this.checkForFavExistence(car)) {
      this.favService.doUnFav(car);
      console.log('unFav');
    } else {
      this.favService.doFav(car);
    }
  }

  checkForFavExistence(car: Car) {
    return this.favService.checkForFavExistence(car);
  }
}
