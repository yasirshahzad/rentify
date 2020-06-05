import { Car } from './../shared/sharedModels';
import { CarService } from './../services/car.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-singl-car',
  templateUrl: './singl-car.component.html',
  styleUrls: ['./singl-car.component.css'],
})
export class SingleCarComponent implements OnInit {
  car$: Observable<Car>;
  array = [1, 2, 3, 4];

  constructor(private route: ActivatedRoute, private carService: CarService) {}

  ngOnInit(): void {
    this.car$ = this.route.paramMap.pipe(
      switchMap((params) => {
        let carId = +params.get('id');
        return this.carService.getCar(carId);
      })
    );
  }
}
