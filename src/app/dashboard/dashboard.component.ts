import { Subscription } from 'rxjs';
import { UserService } from './../services/login.service';
import { OrdersService } from './../service/orders.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isCollapsed = false;

  userSubscipriotn;

  user;
  userSub: Subscription;
  constructor(
    private ordersService: OrdersService,
    private loginService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.loginService.getMe().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['../login']);
  }
}
