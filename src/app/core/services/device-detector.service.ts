import { AfterViewInit, HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService implements AfterViewInit {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());
  isMobile$ = this.isMobileSubject.asObservable();
  
  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobileSubject.next(this.checkIsMobile());
  }

  private checkIsMobile(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }

    return false
  }
}
