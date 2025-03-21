import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CRouterService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.next(true);
      }

      if (event instanceof NavigationEnd) {
        this.loading.next(false);
      }
    });
  }

  public acceptNavigation() {
    console.log("CAN HIDE NAV")
    this.loading.next(false);
  }

  public navigateTo(url: string, delayBeforeNavigation: number | null = 400) {
    this.router.navigateByUrl(url);
  }
}