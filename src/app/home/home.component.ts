import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private scrollPosition: number = 0;
  public screenWidth: number;
  public screenHeight: number;

  public stars: Array<any> = []
  private readonly STARS_POSITIONS_RATIO: Array<any> = [
    {x: 5, y: 15},
    {x: 20, y: 20},
    {x: 20, y: 40},
    {x: 20, y: 70},
    {x: 40, y: 30},
    {x: 50, y: 20},
    {x: 80, y: 25},
    {x: 50, y: 50},
    {x: 55, y: 70},
    {x: 80, y: 85},
    {x: 40, y: 85},
    {x: 10, y: 80},
    {x: 10, y: 50},
    {x: 80, y: 45},
    {x: 75, y: 55},
    {x: -10, y: 40},
    {x: -10, y: 10},
    {x: 20, y: 90},
    {x: 90, y: 10},
    {x: 60, y: 95},
    {x: 90, y: 70},
  ]

  private constructor() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.generateStarsStyle();
  }

  // HOST LISTENER //

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.scrollPosition = window.scrollY;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  // PLANET ANIMATIONS //

  public updatePlanet(): any {
    const percentage: number = this.calculPercentage(2);

    if (percentage > 100) {
      return {
        'scale': 2,
        'opacity': 0
      }
    }

    return {
      'scale': this.getPositionOnPercentage(1, 2, percentage),
      'opacity': this.getPositionOnPercentage(1, 0, percentage)
    }
  }

  // STARS ANIMATIONS //

  private generateStarsStyle(): void {
    this.STARS_POSITIONS_RATIO.forEach(positionsRatio => {
      const randomOriginPosition: number = this.getRandomNumber(50, 600);

      const x: number = this.calculatePercentageValue(positionsRatio.x, this.screenWidth);
      const y: number = this.calculatePercentageValue(positionsRatio.y, this.screenHeight);

      this.stars.push({
        'xStart': x + randomOriginPosition,
        'yStart': y + randomOriginPosition,
        'xEnd': x,
        'yEnd': y,
        'top': '',
        'left': '',
        'opacity': ''
      });
    });
  }

  public updateStarsPositions() {
    const percentage = this.calculPercentage(3);
    
    if (percentage == 0) {
      return;
    }

    this.stars.forEach(star => {
      star.left = `${this.getPositionOnPercentage(star.xStart, star.xEnd, percentage)}px`;
      star.top = `${this.getPositionOnPercentage(star.yStart, star.yEnd, percentage)}px`;
      star.opacity = this.getPositionOnPercentage(0, 1, percentage);
    });

    return this.stars;
  }

  // OTHER FUNCTIONS //

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private calculatePercentageValue(percentage: number, number: number): number {
    return (number * percentage) / 100;
  }

  private calculPercentage(pageIndex: number) {
    const end: number = this.screenHeight * pageIndex
    const start: number = end - this.screenHeight

    const percentage: number = ((this.scrollPosition - start) / (end -  start)) * 100

    if (percentage < 0) {
      return 0
    }

    return percentage
  }

  public getPositionForPage(start: number, end: number, pageIndex: number) {
    return start + (this.calculPercentage(pageIndex) / 100 * (end - start));
  }

  public getPositionOnPercentage(start: number, end: number, percentage: number) {
    return start + (percentage / 100 * (end - start));
  }
}
