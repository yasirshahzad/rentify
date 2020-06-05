import { UserService } from './../services/login.service';
import { FavService } from './../services/fav.service';
import { Subscription, Observable } from 'rxjs';
import { CompareService } from './../services/compare.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  count = 0;
  noOfFav = 0;
  subscription: Subscription;
  subscription2: Subscription;
  user$: Observable<firebase.User>;
  constructor(
    private compareService: CompareService,
    private favService: FavService,
    public loginService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription = this.compareService.compareList$.subscribe((x) => {
      this.count = x.length;
    });
    this.subscription2 = this.favService.favList$.subscribe((x) => {
      this.noOfFav = x.length;
    });

    this.user$ = this.loginService.user$;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
