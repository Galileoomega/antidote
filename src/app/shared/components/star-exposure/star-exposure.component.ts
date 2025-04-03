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
  @ViewChild('baseCanvas') baseCanvasRef!: ElementRef<HTMLCanvasElement>;

  private _targetOffset: number = 0;
  @Input()
  set targetOffset(value: number) {
    if (value !== this._targetOffset && this.ctx != null) {
      this._targetOffset = value;
      this.startAnimation();
    }
  }
  get targetOffset(): number {
    return this._targetOffset;
  }

  private ctx!: CanvasRenderingContext2D;
  private baseCtx!: CanvasRenderingContext2D;
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
  private readonly THRESHOLD = 2;
  
  // CONFIGURABLES
  private readonly STARS_COUNT = this.width * 1.1;
  private readonly STAR_SIZE_RANGE: [number, number] = [0.8, 1.5];

  // Debounce timer for resize events.
  private resizeTimeout: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.baseCtx = this.baseCanvasRef.nativeElement.getContext('2d')!;

    this.resizeCanvas();
    this.initializeStars();
    this.drawFixedStars();
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
      this.drawFixedStars();
    }, 200);
  }

  private resizeCanvas(): void {
    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.height = this.height;
    
    this.baseCanvasRef.nativeElement.width = this.width;
    this.baseCanvasRef.nativeElement.height = this.height;
  }

  private initializeStars(): void {
    this.stars = Array.from({ length: this.STARS_COUNT }, () => this.createStar());
  }

  private drawFixedStars(): void {
    for (const star of this.stars) {
      this.updateStar(star);
      this.drawStar(star);
    }
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
    this.baseCtx.fillStyle = star.color;
    this.baseCtx.beginPath();
    this.baseCtx.arc(
      this.centerX + Math.cos(star.angle) * star.radius, 
      this.centerY + Math.sin(star.angle) * star.radius, 
      star.size, 
      0, 
      Math.PI * 2
    );
    this.baseCtx.fill();
  }

  private drawExposureArc(star: Star): void {
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, star.radius, star.angle, star.endAngle, false);
    this.ctx.strokeStyle = star.color;
    this.ctx.lineWidth = star.size * 2;
    this.ctx.stroke();
  }
}