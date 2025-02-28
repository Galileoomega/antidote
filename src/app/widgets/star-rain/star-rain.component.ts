import { CommonModule } from '@angular/common';
import { Component, Input, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

/** Interface defining star position ratios */
interface StarPosition {
  x: number;
  y: number;
}

/** Interface defining star style properties */
interface StarStyle {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  left: string;
  top: string;
  opacity: number;
}

/** Constants for star animation */
const ANIMATION_CONSTANTS = {
  MIN_RANDOM_OFFSET: 50,
  MAX_RANDOM_OFFSET: 700,
  ANIMATION_START_PAGE: 3,
  FADE_OUT_PAGE: 4
} as const;

@Component({
  selector: 'app-star-rain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rain.component.html',
  styleUrl: './star-rain.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRainComponent implements OnInit, OnDestroy {
  /** Fixed star positions relative to screen size */
  private readonly STARS_POSITIONS_RATIO: readonly StarPosition[] = [
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
  private screenHeight: number;
  private screenWidth: number;

  /** Scroll position input with validation */
  @Input() set scrollPosition(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      console.warn('Invalid scroll position provided to StarRainComponent');
      this._scrollPosition = 0;
    } else {
      this._scrollPosition = value;
      this.updateStars();
    }
  }
  get scrollPosition(): number {
    return this._scrollPosition;
  }
  private _scrollPosition = 0;

  /** Subject for cleanup */
  private readonly destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.generateStarsStyle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Utility function to calculate percentage value relative to a given number.
   * @param percentage - The percentage to calculate
   * @param base - The base number to calculate from
   * @returns The calculated value
   */
  private calculatePercentageValue(percentage: number, base: number): number {
    if (percentage < 0 || base < 0) return 0;
    return (base * percentage) / 100;
  }

  /**
   * Generates initial star positions based on predefined ratios.
   */
  private generateStarsStyle(): void {
    try {
      this.stars = this.STARS_POSITIONS_RATIO.map(position => {
        const randomOffset = this.getRandomNumber(
          ANIMATION_CONSTANTS.MIN_RANDOM_OFFSET,
          ANIMATION_CONSTANTS.MAX_RANDOM_OFFSET
        );
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
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error generating star styles:', error);
      this.stars = [];
    }
  }

  /**
   * Generates a random number between min and max.
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number within range
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates an interpolated position between start and end based on a percentage.
   * @param start - Start value
   * @param end - End value
   * @param percentage - Percentage of interpolation
   * @returns Interpolated value
   */
  private interpolate(start: number, end: number, percentage: number): number {
    return start + (Math.max(0, Math.min(200, percentage)) / 100) * (end - start);
  }

  /**
   * Updates star positions based on scroll position.
   * @returns Array of updated star styles
   */
  public updateStarsPositions(): StarStyle[] {
    const percentage = this.calculateScrollPercentage(ANIMATION_CONSTANTS.ANIMATION_START_PAGE);

    if (percentage <= 0 || percentage >= 200) return [];

    try {
      this.stars.forEach(star => {
        star.left = `${this.interpolate(star.xStart, star.xEnd, percentage)}px`;
        star.top = `${this.interpolate(star.yStart, star.yEnd, percentage)}px`;
        star.opacity = percentage > 100
          ? this.interpolate(1, 0, this.calculateScrollPercentage(ANIMATION_CONSTANTS.FADE_OUT_PAGE))
          : this.interpolate(0, 1, percentage);
      });

      return this.stars;
    } catch (error) {
      console.error('Error updating star positions:', error);
      return [];
    }
  }

  /**
   * Updates stars and triggers change detection
   */
  private updateStars(): void {
    this.updateStarsPositions();
    this.cdr.markForCheck();
  }

  /**
   * Calculates scroll percentage for a given page index.
   * @param pageIndex - The page index to calculate percentage for
   * @returns Calculated percentage
   */
  private calculateScrollPercentage(pageIndex: number): number {
    if (pageIndex < 1) return 0;
    const start = this.screenHeight * (pageIndex - 1);
    return Math.max(0, ((this.scrollPosition - start) / ((this.screenHeight * pageIndex) - start)) * 100);
  }

  /**
   * Updates screen dimensions on resize and regenerates stars.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.generateStarsStyle();
  }
}
