import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  imports: [CommonModule],
  templateUrl: './scrollbar.component.html',
  styleUrl: './scrollbar.component.scss'
})
export class ScrollbarComponent implements AfterViewInit {
  @ViewChildren('scrollbar') target!: ElementRef;

  @Input() scrollPosition: number = 0;
  @Input() numberOfPage: number = 0;

  public containerHeight: number = 200;
  public barHeight: number = 150;

  oldPosition: number = 0
  lastUpdate: number = new Date().getTime();
  element!: HTMLElement;

  constructor() {
    setInterval(() => this.manageVisibility(), 200);
  }

  ngAfterViewInit() {
    this.element = document.getElementById('bar-container')!;
  }

  public calculateBarPosition() {
    let final = window.innerHeight * this.numberOfPage;

    const value = this.barHeight * (this.scrollPosition / final);

    return {
      'margin-top': value + 'px'
    };
  }

  aa() {
    console.log(this.element)
  }

  private manageVisibility() {
    // GOT AN UPDATE
    if(this.scrollPosition != this.oldPosition) {
      this.lastUpdate = new Date().getTime();
      this.oldPosition = this.scrollPosition;
      this.element.classList.replace('hide', 'show');
      
      return
    }

    if(new Date().getTime() - this.lastUpdate > 1000) {
      this.element.classList.replace('show', 'hide');
    }
  }
}
