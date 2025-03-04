import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges } from '@angular/core';

type RGB = [number, number, number];

interface RingConfig {
  borderColor: string;
  borderWidth: number;
  offset: number;
  blur?: number;
}

@Component({
  selector: 'app-planet-gen',
  imports: [CommonModule],
  templateUrl: './planet-gen.component.html',
  styleUrl: './planet-gen.component.scss'
})
export class PlanetGenComponent implements OnChanges {
  @Input() gradient: RGB[] = [];
  @Input() animPercentage: number = 0;
  @Input() hasRings: boolean = false;
  @Input() planetSize: number = 900;
  @Input() hasPerspective: boolean = false;
  
  public readonly BASE_SIZE: number = 600;
  public readonly RINGS_CONFIG: RingConfig[] = [
    { borderColor: '#c7c9ffbf', borderWidth: 10, offset: 140, blur: 10 },
  ];
  
  public scaleFactor: number = 1;
  public mouseOffsetY: number = 0;
  public mouseOffsetX: number = 0;

  getRingStyles(config: RingConfig, hasZIndex: boolean = false): { [key: string]: string } {
    return {
      '--offset': `${config.offset}px`,
      '--border-color': config.borderColor,
      '--border-width': `${config.borderWidth}px`,
      '--blur': `${config.blur || 15}px`,
      'z-index': hasZIndex ? '1' : 'auto'
    };
  }

  constructor() {}

  ngOnChanges(): void {
    this.scaleFactor = this.planetSize / this.BASE_SIZE;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent) {
    if (this.hasPerspective && this.hasRings) {
      this.calculateMouseOffsetFromCenter(event); 
    }
  }

  private calculateMouseOffsetFromCenter(mouse: MouseEvent): void {
    // Get the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the mouse offset from the center
    const mouseOffsetX = mouse.clientX - centerX;
    const mouseOffsetY = mouse.clientY - centerY;

    // Calculate the percentage of the offset relative to the screen dimensions
    this.mouseOffsetX = (mouseOffsetX / centerX) * 100
    this.mouseOffsetY = (mouseOffsetY / centerY) * 100
  }
  
  /**
   * Generates a linear gradient background based on the given progress.
   * @param progress The interpolation percentage (0-100).
   * @param reverse Whether to reverse the gradient direction.
   * @returns A CSS background style.
   */
  private getGradientStyles(percentage: number, reverse: boolean = false): { background: string } {
    const start = reverse ? this.gradient[1] : this.gradient[0];
    const end = reverse ? this.gradient[0] : this.gradient[1];

    const r = this.interpolate(start[0], end[0], percentage);
    const g = this.interpolate(start[1], end[1], percentage);
    const b = this.interpolate(start[2], end[2], percentage);

    return {
      background: `linear-gradient(126deg, rgba(${r}, ${g}, ${b}, 1) ${percentage}%, black ${reverse ? 90 : 80}%)`
    };
  }

  /**
   * Updates the second color gradient, with a reversed gradient direction.
   * @param percentage The percentage to adjust the gradient.
   * @returns The updated background style for the reversed gradient.
   */
  generatePrimaryGradient(percentage: number = 0): { background: string } {
    return this.getGradientStyles(percentage, true);
  }

  /**
   * Updates the first color gradient based on the given percentage.
   * @param percentage The percentage to adjust the gradient.
   * @returns The updated background style for the first gradient.
   */
  generateSecondaryGradient(percentage: number = 0): { background: string } {
    return this.getGradientStyles(percentage);
  }

  /**
   * Updates the mask background based on the percentage.
   * The mask is a linear gradient that transitions from transparent to black.
   * @param percentage The percentage to adjust the mask's opacity.
   * @returns The updated mask background style.
   */
  updateMask(percentage: number): { background: string } {
    return {
      background: `linear-gradient(126deg, #00000000 0%, #000000 ${this.interpolate(100, 0, percentage)}%)`
    };
  }

  /**
   * Interpolates between two values based on the given progress percentage.
   * @param start The starting value of the interpolation.
   * @param end The ending value of the interpolation.
   * @param progress The progress percentage (0 to 100).
   * @returns The interpolated value.
   */
  interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * (progress / 100);
  }

  generateStyleVariables() {
    return {
      '--base-size': this.BASE_SIZE + 'px', 
      '--scale': this.scaleFactor, 
      '--wanted-size': this.planetSize + 'px', 
      '--perspectiveY': this.interpolate(80, 82, this.mouseOffsetY * -1) + 'deg',
      '--perspectiveX': this.interpolate(0, 1, this.mouseOffsetX) + 'deg',
    }
  }
}