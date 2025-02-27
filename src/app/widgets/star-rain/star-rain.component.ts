import { CommonModule } from '@angular/common';
import { Component, Input, HostListener } from '@angular/core';

interface StarPosition {
  x: number;
  y: number;
}

interface StarStyle {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  left: string;
  top: string;
  opacity: number;
}

@Component({
  selector: 'app-star-rain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rain.component.html',
  styleUrl: './star-rain.component.scss'
})
export class StarRainComponent {
  /** Fixed star positions relative to screen size */
  private readonly STARS_POSITIONS_RATIO: StarPosition[] = [
    { x: 5, y: 15 }, { x: 20, y: 20 }, { x: 20, y: 40 }, { x: 20, y: 70 },
    { x: 40, y: 30 }, { x: 50, y: 20 }, { x: 80, y: 25 }, { x: 50, y: 50 },
    { x: 55, y: 70 }, { x: 80, y: 85 }, { x: 40, y: 85 }, { x: 10, y: 80 },
    { x: 10, y: 50 }, { x: 80, y: 45 }, { x: 75, y: 55 }, { x: -10, y: 40 },
    { x: -10, y: 10 }, { x: 20, y: 90 }, { x: 90, y: 10 }, { x: 60, y: 95 },
    { x: 90, y: 70 }, { x: 90, y: 40 }, { x: 40, y: 54 }, { x: 63, y: 50 },
    { x: 100, y: 100 }, { x: 100, y: 120 }, { x: 5, y: 100 }, { x: 55, y: 100 },
    { x: 55, y: 10 }
  ];

  /** Holds dynamically calculated star styles */
  public stars: StarStyle[] = [];

  /** Window dimensions */
  private screenHeight = window.innerHeight;
  private screenWidth = window.innerWidth;

  /** Scroll position input */
  @Input() scrollPosition = 0;

  constructor() {
    this.generateStarsStyle();
  }

  /**
   * Utility function to calculate percentage value relative to a given number.
   */
  private calculatePercentageValue(percentage: number, base: number): number {
    return (base * percentage) / 100;
  }

  /**
   * Generates initial star positions based on predefined ratios.
   */
  private generateStarsStyle(): void {
    this.stars = this.STARS_POSITIONS_RATIO.map(position => {
      const randomOffset = this.getRandomNumber(50, 700);
      const x = this.calculatePercentageValue(position.x, this.screenWidth);
      const y = this.calculatePercentageValue(position.y, this.screenHeight);
      
      return {
        xStart: x + randomOffset,
        yStart: y + randomOffset,
        xEnd: x,
        yEnd: y,
        left: `${x}px`,
        top: `${y}px`,
        opacity: 0
      };
    });
  }

  /**
   * Generates a random number between min and max.
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates an interpolated position between start and end based on a percentage.
   */
  private interpolate(start: number, end: number, percentage: number): number {
    return start + (percentage / 100) * (end - start);
  }

  /**
   * Updates star positions based on scroll position.
   */
  public updateStarsPositions(): StarStyle[] {
    const percentage = this.calculateScrollPercentage(3);

    if (percentage <= 0 || percentage >= 200) return [];

    this.stars.forEach(star => {
      star.left = `${this.interpolate(star.xStart, star.xEnd, percentage)}px`;
      star.top = `${this.interpolate(star.yStart, star.yEnd, percentage)}px`;
      star.opacity = percentage > 100
        ? this.interpolate(1, 0, this.calculateScrollPercentage(4))
        : this.interpolate(0, 1, percentage);
    });

    return this.stars;
  }

  /**
   * Calculates scroll percentage for a given page index.
   */
  private calculateScrollPercentage(pageIndex: number): number {
    const start = this.screenHeight * (pageIndex - 1);
    return Math.max(0, ((this.scrollPosition - start) / ((this.screenHeight * pageIndex) - start)) * 100);
  }

  /**
   * Updates screen dimensions on resize.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.generateStarsStyle();
  }
}
