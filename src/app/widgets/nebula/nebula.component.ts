import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-nebula',
  imports: [CommonModule],
  templateUrl: './nebula.component.html',
  styleUrl: './nebula.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NebulaComponent implements OnInit {
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mouseOffsetX: number = 0;
  private mouseOffsetY: number = 0;
  finalX: number = 0;
  finalY: number = 0;
  smoothingFactor: number = 0.05;
  private lastUpdate: number = 0;
  private updateFrequency: number = 16; // Limite la mise à jour à environ 60 fps

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.smoothUpdate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private smoothUpdate(): void {
    const update = (timestamp: number) => {
      // Limiter la fréquence de mise à jour
      if (timestamp - this.lastUpdate >= this.updateFrequency) {
        this.calculateMouseOffsetFromCenter();
        this.finalX += (this.mouseOffsetX - this.finalX) * this.smoothingFactor;
        this.finalY += (this.mouseOffsetY - this.finalY) * this.smoothingFactor;
        this.cdr.markForCheck();
        this.lastUpdate = timestamp;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  private calculateMouseOffsetFromCenter(): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseOffsetX = this.mouseX - centerX;
    const mouseOffsetY = this.mouseY - centerY;
    this.mouseOffsetX = (mouseOffsetX / centerX) * 100;
    this.mouseOffsetY = (mouseOffsetY / centerY) * 100;
  }

  public moveByMouseOffset(speedFactor: number): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    styles['transform'] = `translate(-50%, -50%) perspective(500px) rotateX(${(this.finalY * -1) * 0.5}deg) rotateY(${this.finalX * 0.5}deg)`;
    return styles;
  }
}
