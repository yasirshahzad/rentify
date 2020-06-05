import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarService } from './../services/car.service';
import { Car } from './../shared/sharedModels';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
})
export class CarsComponent implements OnInit, OnDestroy {
  dataSet: Car[] = [];

  carSub: Subscription;
  loading = false;
  constructor(
    private carService: CarService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.carSub = this.carService.getCars().subscribe((car: Car[]) => {
      this.dataSet = car;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.carSub.unsubscribe();
  }

  deleteCar(id) {
    console.log(id);
    this.carService
      .deleteCar(id)
      .then((result) => {
        this.notification.success('Action completd', 'Car has been deleted. ', {
          nzPlacement: 'bottomLeft',
        });
      })
      .catch((err) => {
        this.notification.error('Action not completed', err.message, {
          nzPlacement: 'bottomLeft',
        });
      });
  }
}
