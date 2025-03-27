import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, NgZone } from '@angular/core';

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

  readonly BASE_SIZE = 600;
  scaleFactor = 1;
  mouseOffsetX = 0;
  mouseOffsetY = 0;

  // Flag to throttle mousemove handling.
  private pendingAnimationFrame = false;

  constructor(private ngZone: NgZone) {}

  ngOnChanges(): void {
    this.scaleFactor = this.planetSize / this.BASE_SIZE;
    this.animPercentage = Math.min(100, Math.max(0, this.animPercentage));
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent): void {
    if (!this.shouldUpdatePerspective()) {
      return;
    }
    // Throttle updates using requestAnimationFrame.
    if (!this.pendingAnimationFrame) {
      this.pendingAnimationFrame = true;
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.updateMouseOffsets(event);
          this.pendingAnimationFrame = false;
        });
      });
    }
  }

  private shouldUpdatePerspective(): boolean {
    return this.hasPerspective && this.hasRings;
  }

  private updateMouseOffsets(event: MouseEvent): void {
    const offsetX = event.clientX - window.innerWidth / 2;
    const offsetY = event.clientY - window.innerHeight / 2;
    this.mouseOffsetX = (offsetX / (window.innerWidth / 2)) * 100;
    this.mouseOffsetY = (offsetY / (window.innerHeight / 2)) * 100;
  }

  updateMask(percentage: number): { [key: string]: string } {
    const startOpacity = 20;
    const endOpacity = 70;
    const margin = 5;
    const interpolatedOpacityStart = this.interpolate(startOpacity, 0, percentage);
    const interpolatedOpacityEnd = this.interpolate(endOpacity, 0, percentage);
    const interpolatedMargin = this.interpolate(margin, 0, percentage);
    return {
      background: `linear-gradient(126deg, #00000000 ${interpolatedOpacityStart}%, #000000 ${interpolatedOpacityEnd}%)`,
      'margin-top': `${interpolatedMargin}%`,
      'margin-left': `${interpolatedMargin}%`,
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
