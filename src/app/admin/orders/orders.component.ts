import { UserService } from './../../services/login.service';
import { CarService } from './../../services/car.service';
import { Order, User } from './../../shared/sharedModels';
import { AngularFireDatabase } from '@angular/fire/database';
import { OrdersService } from './../../service/orders.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  dataSet = [];
  loading: boolean = true;
  subscription: Subscription;

  user: User;
  userSubscription: Subscription;
  constructor(
    private orderService: OrdersService,
    private carService: CarService,
    private auth: UserService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.userSubscription = this.auth.getMe().subscribe((user) => {
      this.user = user;
      if (this.user?.isAdmin) {
        this.subscription = this.orderService.getOrders().subscribe((data) => {
          this.dataSet = data;
          this.loading = false;
        });
      } else {
        this.subscription = this.orderService
          .getOrdersByUser(this.user.id)
          .subscribe((data) => {
            this.dataSet = data;
            this.loading = false;
          });
      }
    });
  }
}
