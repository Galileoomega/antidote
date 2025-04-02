import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  public scrollPositions = new Map<string, number>();

  constructor(private router: Router, private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.ngZone.onStable
            .pipe(take(1))
            .subscribe(() => {
              const savedScroll = this.scrollPositions.get(this.router.url);
              if (savedScroll != null) {
                window.scrollTo(0, savedScroll);
                this.clearScrollPosition();
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