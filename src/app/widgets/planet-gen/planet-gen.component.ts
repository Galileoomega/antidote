import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-planet-gen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-gen.component.html',
  styleUrl: './planet-gen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetGenComponent implements OnChanges {
  private readonly BASE_SIZE: number = 600;

  @Input() primaryColor: string = '#000000';
  @Input() secondaryColor: string = '#ffffff';
  @Input() animPercentage: number = 0;
  @Input() hasRings: boolean = false;
  @Input() planetSize: number = this.BASE_SIZE;
  @Input() hasPerspective: boolean = false;
  
  public scaleFactor: number = 1;
  public mouseOffset: { x: number, y: number } = { x: 0, y: 0 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planetSize']) {
      this.validateAndUpdatePlanetSize();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent): void {
    if (this.hasPerspective && this.hasRings) {
      this.mouseOffset = this.calculateMouseOffsetFromCenter(event); 
    }
  }

  updateMask(percentage: number): { background: string } {
    return {
      background: `linear-gradient(126deg, #00000000 0%, #000000 ${this.interpolate(100, 0, percentage)}%)`
    };
  }

  generateStyleVariables(): Record<string, string> {
    return {
      '--base-size': this.BASE_SIZE + 'px',
      '--scale': this.scaleFactor.toString(),
      '--wanted-size': this.planetSize + 'px',
      '--perspectiveY': this.interpolate(80, 82, this.mouseOffset.y * -1) + 'deg',
      '--perspectiveX': this.interpolate(0, 1, this.mouseOffset.x) + 'deg',
      '--color-primary': this.primaryColor,
      '--color-secondary': this.secondaryColor
    };
  }

  private calculateMouseOffsetFromCenter(mouse: MouseEvent): {x: number, y: number} {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const mouseOffsetX = mouse.clientX - centerX;
    const mouseOffsetY = mouse.clientY - centerY;

    return {x: (mouseOffsetX / centerX) * 100, y: (mouseOffsetY / centerY) * 100};
  }

  private validateAndUpdatePlanetSize(): void {
    this.scaleFactor = this.planetSize / this.BASE_SIZE;
  }

  private interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * (progress / 100);
  }
}