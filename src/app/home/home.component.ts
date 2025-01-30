import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public scrollPosition: number = 0;
  
  public screenWidth: number = 0;
  public screenHeight: number = 0;

  private constructor() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  calculpercentage(pageIndex: number) {
    let end = this.screenHeight * pageIndex
    let start = end - this.screenHeight

    let percentage = ((this.scrollPosition - start) / (end -  start)) * 100

    if (percentage > 100) {
      return 100
    }

    if (percentage < 0) {
      return 0
    }

    return percentage
  }

  getValue(start: number, end: number, pageIndex: number) {
    let percentage =  this.calculpercentage(pageIndex)
    return start + (percentage / 100 * (end - start))
  }

  genPlanet(): any {
    return {
      'scale': this.getValue(1, 3, 2)
    }
  }
}
