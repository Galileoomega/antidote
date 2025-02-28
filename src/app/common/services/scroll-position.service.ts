import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  private scrollPositions = new Map<string, number>();

  constructor(private router: Router) {
    window.history.scrollRestoration = 'manual';

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if(this.scrollPositions.has(this.router.url)) {
        window.scrollTo(0, this.scrollPositions.get(this.router.url) || 0);
      
        this.clearScrollPosition();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  public saveScrollPosition() {
    this.scrollPositions.set(this.router.url, window.scrollY);
  }

  public clearScrollPosition() {
    this.scrollPositions.clear();
  } 
} 