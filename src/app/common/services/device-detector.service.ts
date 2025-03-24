import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    // Initial check
    this.onResize();
    // Listen to window resize events
    window.addEventListener('resize', () => this.onResize());
  }

  private checkIsMobile(): boolean {
    return window.innerWidth <= 768;
  }

  private onResize(): void {
    const isMobile = this.checkIsMobile();
    this.isMobileSubject.next(isMobile);
  }
}
