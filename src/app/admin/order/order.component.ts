import { Order, Extra } from './../../shared/sharedModels';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/login.service';
import { OrdersService } from '../../service/orders.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, OnDestroy {
  order: Order;
  isLoading: boolean = true;
  subscription: Subscription;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  switchValue;

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          return this.ordersService.get(params.get('id'));
        })
      )
      .subscribe((order) => {
        this.order = order;
        this.isLoading = false;
      });
  }

  calculateDays(returnDate, pickupDate) {
    var t2 = new Date(returnDate).getTime();
    var t1 = new Date(pickupDate).getTime();

    return (t2 - t1) / (24 * 3600 * 1000);
  }

  calculateBill(price, prices, returnDate, pickupDate, extras?: Extra[]) {
    let bill = 0;
    let totalBill = 0;
    if (this.calculateDays(returnDate, pickupDate) === 1) {
      totalBill = price;
      return;
    }

    prices.map((x) => {
      if (this.calculateDays(returnDate, pickupDate) > x.days) {
        totalBill = this.calculateDays(returnDate, pickupDate) * x.price;
      }
    });

    extras.map((extra) => {
      bill += extra.Price;
    });

    totalBill = totalBill + bill;
    return totalBill;
  }
}
