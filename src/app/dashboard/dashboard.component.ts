import { UserService } from './../services/login.service';
import { OrdersService } from './../service/orders.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private ordersService: OrdersService,
    private loginService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.loginService.logout();
    this.router.navigate(['../login']);
  }
}
