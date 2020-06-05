import { map } from 'rxjs/operators';
import { Car } from './../shared/sharedModels';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  url: string;
  constructor(private http: HttpClient) {
    this.url = environment.API;
  }

  getModels() {
    return this.http.get<Car[]>(this.url + 'cars');
  }
}
