import { CarService } from './../services/car.service';
import { UserService } from './../services/login.service';
import { Order } from './../shared/sharedModels';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  URL = environment.API;
  constructor(
    private db: AngularFireDatabase,
    private auth: UserService,
    private carService: CarService
  ) {}

  createOrder(order) {
    return this.db.list<Order>('/orders').push(order);
  }

  getOrders() {
    return this.db
      .list<Order>('/orders/')
      .snapshotChanges()
      .pipe(
        map((items) => {
          return items.map((a) => {
            const data: any = a.payload.val();
            const key = a.payload.key;
            return { key, ...data };
          });
        }),
        map((list) => {
          list.map((order: Order) => {
            order.car = this.carService.getCar(order.carId);
          });
          return list;
        })
      );
  }

  getOrdersByUser(uid) {
    return this.db
      .list<Order>('/orders/', (ref) => ref.orderByChild('userId').equalTo(uid))
      .snapshotChanges()
      .pipe(
        map((items) => {
          return items.map((a) => {
            const data: any = a.payload.val();
            const key = a.payload.key;
            return { key, ...data };
          });
        }),
        map((list) => {
          list.map((order: Order) => {
            order.car = this.carService.getCar(order.carId);
          });
          return list;
        })
      );
  }

  get(id: string) {
    return this.db
      .object<Order>('/orders/' + id)
      .snapshotChanges()
      .pipe(
        map((item) => {
          return { key: item.payload.key, ...item.payload.val() };
        }),
        map((order: Order) => {
          order.car = this.carService.getCar(order.carId);
          order.user = this.auth.get(order.userId);
          return order;
        })
      );
  }

  updateOrder(order, key) {
    return this.db.object('orders/' + order.id).set({
      carId: order.carId,
      extras: order.extras,
      orderDate: order.orderDate,
      userId: order.userId,
      pickup: order.pickup,
      return: order.return,
      status: order.status,
    });
  }
}
