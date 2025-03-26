import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild, NgZone, AfterViewInit, OnDestroy } from '@angular/core';

interface Star {
  angle: number;
  endAngle: number;
  radius: number;
  color: string;
  size: number;
}

const STAR_COLORS: string[] = ["#7A60DC", "#6757AA", "#231E3B", "#CAC8EF", "#2F2C41"];

@Component({
  selector: 'app-star-exposure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-exposure.component.html',
  styleUrls: ['./star-exposure.component.scss']
})
export class StarExposureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('warpCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private _targetOffset: number = 0;
  @Input()
  set targetOffset(value: number) {
    if (value !== this._targetOffset) {
      this._targetOffset = value;
      if (!this.isAnimating) {
        this.startAnimation();
      }
    }
  }
  get targetOffset(): number {
    return this._targetOffset;
  }

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private width = window.innerWidth;
  private height = window.innerHeight;
  private centerX = this.width / 2;
  private centerY = this.height / 2;
  private animationFrameId: number | null = null;
  private isAnimating = false;
  
  // Smoothing state
  private offset: number = 0;
  private readonly SMOOTHING_FACTOR = 0.3;
  private readonly THRESHOLD = 8;
  
  // CONFIGURABLES
  // Use a fixed star count to reduce load instead of basing on window.innerWidth.
  private readonly MAX_STARS = this.width;
  private readonly STAR_SIZE_RANGE: [number, number] = [0.8, 1.5];

  // Debounce timer for resize events.
  private resizeTimeout: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.initializeStars();
    this.ngZone.runOutsideAngular(() => this.draw());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  @HostListener('window:resize')
  onResize(): void {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.resizeCanvas();
      this.initializeStars();
    }, 200);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initializeStars(): void {
    this.stars = Array.from({ length: this.MAX_STARS }, () => this.createStar());
  }

  private createStar(): Star {
    const angle: number = Math.random() * Math.PI * 2;

    return {
      angle: angle,
      endAngle: angle,
      radius: Math.pow(Math.random(), 0.6) * Math.sqrt(this.width ** 2 + this.height ** 2) / 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      size: Math.random() * (this.STAR_SIZE_RANGE[1] - this.STAR_SIZE_RANGE[0]) + this.STAR_SIZE_RANGE[0]
    };
  }

  private startAnimation(): void {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.ngZone.runOutsideAngular(() => this.draw());
    }
  }

  private stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private draw = (): void => {
    this.offset += (this.targetOffset - this.offset) * this.SMOOTHING_FACTOR;

    this.clearCanvas();

    for (const star of this.stars) {
      this.updateStar(star);
      this.drawExposureArc(star);
    }

    if (this.offset > this.THRESHOLD) {
      this.animationFrameId = requestAnimationFrame(this.draw);
    } else {
      this.offset = this.targetOffset;
      this.clearCanvas();

      for (const star of this.stars) {
        this.updateStar(star);
        this.drawStar(star);
      }

      this.stopAnimation();
    }
  };

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private updateStar(star: Star): void {
    star.endAngle = star.angle + (this.offset * 0.001);
  }

  private drawStar(star: Star): void {
    this.ctx.fillStyle = star.color;
    this.ctx.beginPath();
    this.ctx.arc(
      this.centerX + Math.cos(star.angle) * star.radius, 
      this.centerY + Math.sin(star.angle) * star.radius, 
      star.size, 
      0, 
      Math.PI * 2
    );
    this.ctx.fill();
  }

  private drawExposureArc(star: Star): void {
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, star.radius, star.angle, star.endAngle, false);
    this.ctx.strokeStyle = star.color;
    this.ctx.lineWidth = star.size * 2;
    this.ctx.stroke();
  }
}
