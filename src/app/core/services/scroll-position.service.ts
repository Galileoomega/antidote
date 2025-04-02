import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  public scrollPositions = new Map<string, number>();

  navCount = 0

  constructor(private router: Router, private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.ngZone.onStable
            .pipe(take(1))
            .subscribe(() => {
              this.navCount++;

              if(this.navCount > 2) {
                this.clearScrollPosition();
                this.navCount = 0;
              }

              const savedScroll = this.scrollPositions.get(this.router.url);

              if (savedScroll != null) {
                window.scrollTo(0, savedScroll);
                this.clearScrollPosition();
                this.navCount = 0;
              } else {
                window.scrollTo(0, 0);
              }
            });
        });
    }
  }

  public saveScrollPosition(): void {
    this.scrollPositions.set(this.router.url, window.scrollY);
  }

  public clearScrollPosition(): void {
    this.scrollPositions.clear();
  }
}