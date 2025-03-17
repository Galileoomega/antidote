import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-planet-gen',
  imports: [CommonModule],
  templateUrl: './planet-gen.component.html',
  styleUrls: ['./planet-gen.component.scss']
})
export class PlanetGenComponent implements OnChanges {
  @Input() primaryColor: string = 'red';
  @Input() secondaryColor: string = 'blue';
  @Input() animPercentage: number = 0;
  @Input() hasRings: boolean = false;
  @Input() planetSize: number = 900;
  @Input() hasPerspective: boolean = false;

  public readonly BASE_SIZE = 600;

  public scaleFactor = 1;
  public mouseOffsetX = 0;
  public mouseOffsetY = 0;

  constructor() {}

  ngOnChanges(): void {
    this.scaleFactor = this.calculateScaleFactor();
    this.animPercentage = this.clampPercentage(this.animPercentage);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent): void {
    if (this.shouldUpdatePerspective()) {
      this.updateMouseOffsets(event);
    }
  }

  private calculateScaleFactor(): number {
    return this.planetSize / this.BASE_SIZE;
  }

  private clampPercentage(value: number): number {
    return Math.min(100, Math.max(0, value));
  }

  private shouldUpdatePerspective(): boolean {
    return this.hasPerspective && this.hasRings;
  }

  private updateMouseOffsets(event: MouseEvent): void {
    const { offsetX, offsetY } = this.calculateMouseOffsetFromCenter(event);
    this.mouseOffsetX = this.normalizeOffset(offsetX, window.innerWidth);
    this.mouseOffsetY = this.normalizeOffset(offsetY, window.innerHeight);
  }

  private calculateMouseOffsetFromCenter(event: MouseEvent): { offsetX: number, offsetY: number } {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return {
      offsetX: event.clientX - centerX,
      offsetY: event.clientY - centerY,
    };
  }

  private normalizeOffset(offset: number, dimension: number): number {
    return (offset / (dimension / 2)) * 100;
  }

  updateMask(percentage: number): any {
    const startOpacity = 20;
    const endOpacity = 70;
    const margin = 5;

    return {
      'background': `linear-gradient(126deg, #00000000 ${this.interpolate(startOpacity, 0, percentage)}%, #000000 ${this.interpolate(endOpacity, 0, percentage)}%)`,
      'margin-top': `${this.interpolate(margin, 0, percentage)}%`,
      'margin-left': `${this.interpolate(margin, 0, percentage)}%`,
    };
  }

  interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * (progress / 100);
  }

  generateStyleVariables(): Record<string, string> {
    return {
      '--base-size': `${this.BASE_SIZE}px`,
      '--scale': `${this.scaleFactor}`,
      '--wanted-size': `${this.planetSize}px`,
      '--perspectiveY': `${this.interpolate(80, 82, -this.mouseOffsetY)}deg`,
      '--perspectiveX': `${this.interpolate(0, 1, this.mouseOffsetX)}deg`,
      '--color-primary': this.primaryColor,
      '--color-secondary': this.secondaryColor,
    };
  }
}
