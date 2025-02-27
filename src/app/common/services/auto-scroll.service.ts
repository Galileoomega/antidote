import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoScrollService {
  private scrollDirection: 'up' | 'down' | 'none' = 'none';
  private scrollPosition = window.scrollY;
  private oldScrollPosition = window.scrollY;
  private autoScrollInterval: any;
  private autoScrollSpeed = 1;

  constructor() {
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  private onWindowScroll(): void {
    this.scrollPosition = window.scrollY;

    if (this.oldScrollPosition < this.scrollPosition) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }

    this.oldScrollPosition = this.scrollPosition;
  }

  public activateAutoScroll(): void {
    if (!this.autoScrollInterval) {
      this.autoScrollInterval = setInterval(() => {
        if (this.scrollDirection === 'down') {
          window.scrollBy(0, 5);
        } else {
          window.scrollBy(0, -5);
        }

        this.scrollPosition = window.scrollY;

        if (this.scrollPosition + window.innerHeight >= document.body.scrollHeight) {
          this.stopAutoScroll();
        }
      }, this.autoScrollSpeed);
    }
  }

  public stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
}
