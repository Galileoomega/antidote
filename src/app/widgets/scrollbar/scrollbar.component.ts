import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  imports: [CommonModule],
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss']
})
export class ScrollbarComponent implements AfterViewInit {
  @ViewChild('scrollbar') target!: ElementRef;

  @Input() scrollPosition: number = 0;
  @Input() numberOfPage: number = 0;

  public containerHeight: number = 200;
  public barHeight: number = 150;

  private hideTimeout: any = null;
  private element!: HTMLElement;

  constructor() { }

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

  ngAfterViewInit(): void {
    // Get the scrollbar element by its ID.
    this.element = document.getElementById('bar-container')!;
  }

  public calculateBarPosition(): { [key: string]: string } {
    const totalScrollHeight = this.getPageHeight() - window.innerHeight;
    const value = this.barHeight * (this.scrollPosition / totalScrollHeight);
    return { 'margin-top': `${value}px` };
  }

  getPageHeight(): number {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }
}