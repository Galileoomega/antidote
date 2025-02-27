import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

interface Star {
  angle: number;
  radius: number;

  color: string;
  size: number;
}

@Component({
  selector: 'app-star-exposure',
  imports: [CommonModule],
  templateUrl: './star-exposure.component.html',
  styleUrl: './star-exposure.component.scss'
})
export class StarExposureComponent implements OnChanges {
  @ViewChild('warpCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() move: boolean = false;
  @Input() scale: number = 1;

  private ctx!: CanvasRenderingContext2D;
  private stars!: Star[];
  private width!: number;
  private height!: number;
  private animationFrameId!: number;

  private centerX: number = this.width / 2;
  private centerY: number = this.height / 2;

  private currentSpeed: number = 0;
  private animating: boolean = false;

  // CONFIGURABLE VALUES
  private readonly TARGET_SPEED: number = 0.002;
  private readonly STARS_COUNT: number = window.innerWidth * 3;

  private TRAIL_FADE = 1; // Efficient fade with composite operation

  private startInterval: any;
  private endInterval: any;
  private isDrawing: boolean = false;

  // COLOR PALETTE (Fast lookup with bitwise operation)
  private readonly STAR_COLORS: string[] = [
    "#7A60DC",
    "#6757AA",
    "#231E3B",
    "#CAC8EF",
    "#2F2C41"
  ];

  ngOnInit(): void {
    this.initStars();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;

    this.resizeCanvas();
    this.initStars();

    window.addEventListener('resize', () => this.resizeCanvas());
    this.draw();
  }

  ngOnChanges(): void {
    if(this.move == false) {
      this.easeEnd();
    }
    else {
      this.easeStart();
    }

    if (!this.isDrawing) {
      this.draw();
    }
  }

  private easeEnd() {
    clearInterval(this.startInterval)
    clearInterval(this.endInterval)

    const step: number = 0.0001;

    this.endInterval = setInterval(() => {
      this.currentSpeed -= step;
      this.TRAIL_FADE -= 0.1;

      if(this.currentSpeed <= 0) {
        this.TRAIL_FADE = 0;
        this.currentSpeed = 0;
        this.animating = false;
        clearInterval(this.endInterval);
        return;
      }
    }, 50);
  }

  private easeStart() {
    clearInterval(this.endInterval)
    clearInterval(this.startInterval)

    this.animating = true;
    this.TRAIL_FADE = 1;
    const step: number = 0.0001;

    this.startInterval = setInterval(() => {
      this.currentSpeed += step;

      if(this.currentSpeed >= this.TARGET_SPEED) {
        this.currentSpeed = this.TARGET_SPEED;
        
        clearInterval(this.startInterval);
        return;
      }
    }, 50);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initStars(): void {
    this.stars = Array.from({ length: this.STARS_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.sqrt(Math.random()) * this.width,
      color: this.STAR_COLORS[(Math.random() * this.STAR_COLORS.length) | 0],
      size: Math.random() * (1.2 - 0.7) + 0.7
    }));
  }

  private draw(): void {
    this.isDrawing = true;
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.TRAIL_FADE})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';
    console.log(this.currentSpeed)

    for (const star of this.stars) {
      star.angle += this.currentSpeed;

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

    if (this.animating) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
    else {
      this.isDrawing = false;
    }
  }
}
