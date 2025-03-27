import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  imports: [CommonModule],
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss']
})
export class ScrollbarComponent implements AfterViewInit {
  private scrollPosition: number = 0;
  public containerHeight: number = 200;
  public barHeight: number = 150;
  private hideTimeout: any = null;
  private element!: HTMLElement;
  private screenHeight: number = 0;

  constructor() { }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      // Get the scrollbar element by its ID.
      this.element = document.getElementById('bar-container')!;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Update the current scroll position.
    this.scrollPosition = window.scrollY;
    
    // Immediately show the scrollbar.
    this.element.classList.replace('hide', 'show');

    // Reset the hide timer.
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      this.element.classList.replace('show', 'hide');
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenHeight = window.innerHeight;
  }

  public calculateBarPosition(): { [key: string]: string } {
    const totalScrollHeight = this.getPageHeight() - this.screenHeight;
    
    return { 'margin-top': `${this.barHeight * (this.scrollPosition / totalScrollHeight)}px` };
  }

  getPageHeight(): number {
    if (typeof window !== 'undefined') {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    }

    return 0;
  }
}