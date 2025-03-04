import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-planet-gen',
  imports: [CommonModule],
  templateUrl: './planet-gen.component.html',
  styleUrl: './planet-gen.component.scss'
})
export class PlanetGenComponent implements OnChanges {
  @Input() primaryColor: string = 'red';
  @Input() secondaryColor: string = 'blue';

  @Input() animPercentage: number = 0;
  @Input() hasRings: boolean = false;
  @Input() planetSize: number = 900;
  @Input() hasPerspective: boolean = false;
  
  public readonly BASE_SIZE: number = 600;
  
  public scaleFactor: number = 1;
  public mouseOffsetY: number = 0;
  public mouseOffsetX: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.scaleFactor = this.planetSize / this.BASE_SIZE;

    if (changes['animPercentage']) {
      if (this.animPercentage > 100) {
        this.animPercentage = 100;
      }

      if (this.animPercentage < 0) {
        this.animPercentage = 0;
      }
    }
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
   * Updates the mask background based on the percentage.
   * The mask is a linear gradient that transitions from transparent to black.
   * @param percentage The percentage to adjust the mask's opacity.
   * @returns The updated mask background style.
   */
  updateMask(percentage: number): any {
    return {
      'background': `linear-gradient(126deg, #00000000 ${this.interpolate(20, 0, percentage)}%, #000000 ${this.interpolate(70, 0, percentage)}%)`,
      'margin-top': `${this.interpolate(5, 0, percentage)}%`,
      'margin-left': `${this.interpolate(5, 0, percentage)}%`
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
      '--color-primary': this.primaryColor,
      '--color-secondary': this.secondaryColor
    }
  }
}