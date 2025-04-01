import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  imports: [CommonModule],
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss']
})
export class ScrollbarComponent implements AfterViewInit {
  private element!: HTMLElement;
  private scrollPosition: number = 0;
  private hideTimeout: any = null;
  private screenHeight: number = 0;
  
  public readonly BAR_HEIGHT: number = 150;

  constructor() { }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.element = document.getElementById('bar-container')!;
      this.screenHeight = window.innerHeight;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;
    this.element.classList.replace('hide', 'show');

    if(window.scrollY == 0) {
      this.element.classList.replace('show', 'hide');
    }

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
    return { 'margin-top': `${this.BAR_HEIGHT * (this.scrollPosition / (this.getPageHeight() - this.screenHeight))}px` };
  }

  private getPageHeight(): number {
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