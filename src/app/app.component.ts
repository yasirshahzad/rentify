import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './services/login.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Rental';

  constructor(auth: UserService, router: Router) {
    auth.user$.subscribe((user) => {
      if (user) {
        auth.save(user);
        let returnUrl = localStorage.getItem('returnUrl');
        router.navigateByUrl(returnUrl);
      }
    });
  }
}
