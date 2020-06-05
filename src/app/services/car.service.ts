import { AngularFireDatabase } from '@angular/fire/database';
import { Car } from './../shared/sharedModels';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CarService {
  url = environment.API;
  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

  getCars() {
    return this.db
      .list<Car>('/cars/')
      .snapshotChanges()
      .pipe(
        map((items) => {
          return items.map((a) => {
            const data: any = a.payload.val();
            data.id = a.payload.key;
            return { ...data };
          });
        })
      );
  }

  getCar(id): Observable<Car> {
    return this.db
      .object<Car>('/cars/' + id)
      .snapshotChanges()
      .pipe(
        map((item) => {
          const data: any = item.payload.val();
          if (data) data.id = item.payload.key;

          return data;
        })
      );
  }

  getLocations(): Observable<string[]> {
    return this.db
      .list('/cars/')
      .valueChanges()
      .pipe(
        map((carList) => {
          return [
            ...new Set([].concat(...carList.map((car: Car) => car.locations))),
          ];
        })
      );
  }

  deleteCar(id) {
    return this.db.object('/cars/' + id).remove();
  }

  saveCar(car: Car) {
    return this.db.object('/cars/' + car.id).update(car);
  }

  addCar(car: Car) {
    return this.db.list<Car>('/cars/').push(car);
  }
}
