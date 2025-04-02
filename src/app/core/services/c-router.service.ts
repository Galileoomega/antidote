import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CRouterService {
  private loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();
  
  previousUrl: string | null = null;
  currentUrl: string | null = null;

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.next(true);
      }

      if (event instanceof NavigationEnd) {
        this.loading.next(false);

        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  public acceptNavigation(): void {
    this.loading.next(false);
  }

  public navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  public navigateBack(): void {
    if(this.previousUrl == null) {
      this.router.navigateByUrl('');
    }
    else {
      this.router.navigateByUrl(this.previousUrl);
    }
  }
}