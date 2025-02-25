import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

interface Star {
  angle: number;
  radius: number;

  color: string;
}

@Component({
  selector: 'app-star-exposure',
  imports: [],
  templateUrl: './star-exposure.component.html',
  styleUrl: './star-exposure.component.scss'
})
export class StarExposureComponent implements OnChanges {
  @ViewChild('warpCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() move: boolean = false;

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
  private TARGET_SPEED: number = 0.002;
  private readonly STARS_COUNT: number = window.innerWidth; // Reduced for performance
  private readonly STAR_SIZE: number = 1;

  private TRAIL_FADE = 1; // Efficient fade with composite operation

  // COLOR PALETTE (Fast lookup with bitwise operation)
  private readonly STAR_COLORS: string[] = [
    '#1E1C34', '#1C1D39', '#39395D', '#3F4775', '#A0B5F6',
    '#8096CF', '#453D30', '#837E6B', '#8096CF', '#4C240A', '#4D0A72'
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

    this.draw();
  }

  private easeEnd() {
    const step: number = 0.0001;

    const interval = setInterval(() => {
      this.currentSpeed -= step;
      this.TRAIL_FADE -= 0.1;

      if(this.currentSpeed <= 0) {
        this.TRAIL_FADE = 0;
        this.currentSpeed = 0;
        this.animating = false;
        clearInterval(interval);
        return;
      }
    }, 50);
  }

  private easeStart() {
    this.animating = true;
    this.TRAIL_FADE = 1;
    const step: number = 0.0001;

    const interval = setInterval(() => {
      this.currentSpeed += step;

      if(this.currentSpeed >= this.TARGET_SPEED) {
        clearInterval(interval);
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
      color: this.STAR_COLORS[(Math.random() * this.STAR_COLORS.length) | 0]
    }));
  }

  private draw(): void {
    console.log(this.currentSpeed)
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.TRAIL_FADE})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';

    for (const star of this.stars) {
      star.angle += this.currentSpeed;

      this.ctx.fillStyle = star.color;
      this.ctx.beginPath();
      
      this.ctx.arc(
        this.centerX + Math.cos(star.angle) * star.radius, 
        this.centerY + Math.sin(star.angle) * star.radius, 
        this.STAR_SIZE, 
        0, 
        Math.PI * 2
      );
      
      this.ctx.fill();
    }

    if(this.animating == false) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }
}
