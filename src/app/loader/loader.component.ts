import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  // INTERNAL VARIABLES
  @ViewChild('warpCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private width!: number;
  private height!: number;
  private animationFrameId!: number;
  private devicePixelRatio = window.devicePixelRatio || 1;
  private currentSpeed: number = 0;
  private ctxFill = 'rgba(0, 0, 0, 0)';

  // CUSTOMIZATIONS
  private readonly TARGET_SPEED: number = 6;
  private readonly STARS_COUNT: number = 600;
  private readonly LINE_LENGTH: number = 1;

  ngOnInit(): void {
    this.initStars();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.smoothSpeedIncrease()
  }

  private smoothSpeedIncrease(): void {
    let highestSpeed = this.TARGET_SPEED * 10;
    let step = 0.2;
    let ascending = true;

    const speedInterval = setInterval(() => {
      if (this.currentSpeed < highestSpeed && ascending) {
        this.currentSpeed += step;
      } else if (this.currentSpeed > this.TARGET_SPEED) {
        this.ctxFill = 'rgba(0, 0, 0, 1)'
        ascending = false
        this.currentSpeed -= step;
      } else {
        this.currentSpeed = this.TARGET_SPEED;
        clearInterval(speedInterval);
      }
    }, 5);

    this.animate();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;

    this.width = window.innerWidth;
    this.height = window.innerHeight

    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;

    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    this.initStars();
  }

  private initStars(): void {
    let textStarCount = 0;
    this.stars = Array.from({ length: this.STARS_COUNT }, () => {

      textStarCount++

      return {
        x: Math.random() * this.width - this.width / 2,
        y: Math.random() * this.height - this.height / 2,
        z: Math.random() * this.width,
        prevZ: 0
      };
    });
  }

  private animate(): void {
    this.ctx.fillStyle = this.ctxFill;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.stars.forEach(star => {
      star.prevZ = star.z;
      star.z -= this.currentSpeed;

      if (star.z <= 0) {
        star.x = Math.random() * this.width - this.width / 2;
        star.y = Math.random() * this.height - this.height / 2;
        star.z = this.width;
        star.prevZ = this.width;
      }

      const sx = (star.x / star.z) * this.width + this.width / 2;
      const sy = (star.y / star.z) * this.height + this.height / 2;
      const px = (star.x / star.prevZ) * this.width + this.width / 2;
      const py = (star.y / star.prevZ) * this.height + this.height / 2;

      const colorValue = Math.floor(255 * (1.2 - star.z / this.width));
      const rgbMix = `rgb(${colorValue}, ${colorValue}, ${colorValue})`
      this.ctx.strokeStyle = rgbMix;
      this.ctx.lineWidth = 1;
      
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
