import { Car } from './../shared/sharedModels';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, throwError, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FavService {
  favList: Car[] = [];
  favList$ = new ReplaySubject<Car[]>();

  constructor(private http: HttpClient) {
    if (localStorage.getItem('cars')) {
      this.favList = this.getLocalList();
      this.favList$.next(this.favList);
    }
  }

  doFav(car: Car) {
    if (!localStorage.getItem('cars')) {
      this.favList.push(car);
      localStorage.setItem('cars', JSON.stringify(this.favList));
    } else {
      this.favList = this.getLocalList();
      let localCar = this.favList.find((aCar) => aCar.id == car.id);
      if (localCar) {
        return throwError('Car already Exists');
      } else {
        this.favList.push(car);
        localStorage.setItem('cars', JSON.stringify(this.favList));
      }
    }

    this.favList$.next(this.favList);
    return of('Car has been added');
  }

  private getLocalList(): Car[] {
    return JSON.parse(localStorage.getItem('cars'));
  }

  checkForFavExistence(car: Car) {
    if (localStorage.getItem('cars')) {
      let bCar = this.favList.find((x) => x.id === car.id);
      if (bCar) {
        return true;
      }
    }

    return false;
  }

  doUnFav(car: Car) {
    if (localStorage.getItem('cars')) {
      this.favList = this.getLocalList();
      let bCar = this.favList.findIndex((x) => x.id === car.id);
      if (bCar != -1) {
        this.favList.splice(bCar, 1);
        localStorage.setItem('cars', JSON.stringify(this.favList));
        this.favList$.next(this.favList);
        return of('Car has been removed from favourites!');
      }
    } else {
      console.log('here 2');

      throwError('Car not found! Please first add it in the favourite list.');
    }
  }
}
