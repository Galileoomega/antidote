import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  private scrollPositions = new Map<string, number>();
  private preserveScrollPosition = false;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    // Disable automatic scroll restoration
    window.history.scrollRestoration = 'manual';

    // Listen to navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.preserveScrollPosition) {
        const currentRoute = this.router.url;
        const savedPosition = this.scrollPositions.get(currentRoute);
        
        if (savedPosition) {
          // Restore the saved scroll position
          setTimeout(() => {
            window.scrollTo(0, savedPosition);
          });
        }
      } else {
        // Scroll to top on route change
        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      }
    });

    // Save scroll position before navigation
    window.addEventListener('scroll', () => {
      if (this.preserveScrollPosition) {
        this.scrollPositions.set(this.router.url, window.scrollY);
      }
    });
  }

  // Enable/disable scroll position preservation
  setPreserveScroll(preserve: boolean) {
    this.preserveScrollPosition = preserve;
    if (!preserve) {
      // Clear saved positions when disabling preservation
      this.scrollPositions.clear();
    }
  }

  // Method to manually save scroll position for current route
  saveScrollPosition() {
    if (this.preserveScrollPosition) {
      this.scrollPositions.set(this.router.url, window.scrollY);
    }
  }

  // Method to manually restore scroll position for current route
  restoreScrollPosition() {
    if (this.preserveScrollPosition) {
      const currentRoute = this.router.url;
      const savedPosition = this.scrollPositions.get(currentRoute);
      
      if (savedPosition) {
        window.scrollTo(0, savedPosition);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }
} 