import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private percentage = new BehaviorSubject<number>(0);
  currentData$ = this.percentage.asObservable();

  private timeoutId: any;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.startRandomProgress();
      }
    });
  }

  private startRandomProgress() {
    // Reset percentage
    this.percentage.next(0);
    
    // Clear any existing timeout
    clearTimeout(this.timeoutId);

    const updateProgress = () => {
      if (this.percentage.getValue() >= 100) {
        return;
      }

      // Random increment between 1 and 10
      const increment = Math.floor(Math.random() * 9) + 8;
      this.percentage.next(Math.min(this.percentage.getValue() + increment, 100));

      // Set a new random delay between 100ms and 1000ms
      const randomDelay = Math.floor(Math.random() * 200) + 100;
      
      this.timeoutId = setTimeout(updateProgress, randomDelay);
    };

    updateProgress();
  }
}
