import { Car } from './../shared/sharedModels';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  list: Car[] = [];
  compareList$ = new BehaviorSubject<Car[]>(this.list);
  constructor() {}

  addToCompare(car: Car) {
    if (this.list.length >= 3) {
      return throwError('There are already 3 cars in list');
    }

    let listCar = this.list.find((aCar) => aCar.id == car.id);

    if (listCar) {
      return throwError('This car already exits in list');
    }

    this.list.push(car);

    this.compareList$.next(this.list);
    return of('Car has been added');
  }

  removeCar(car: Car) {
    let index = this.list.findIndex((acar) => acar.id == car.id);

    if (index != -1) {
      this.list.splice(index, 1);
    } else {
      return throwError(`${car.model} don't exit in the list.`);
    }

    this.compareList$.next(this.list);
    return of(`Car has been removed from list.`);
  }

  doCarExists(car: Car) {
    let index = this.list.findIndex((acar) => acar.id == car.id);

    if (index != -1) {
      return true;
    }

    return false;
  }
}
