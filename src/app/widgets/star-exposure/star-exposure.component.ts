import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

interface Star {
  angle: number;
  endAngle: number;
  radius: number;
  color: string;
  size: number;
}

const STAR_COLORS: string[] = [
  "#7A60DC",
  "#6757AA",
  "#231E3B",
  "#CAC8EF",
  "#2F2C41"
];

@Component({
  selector: 'app-star-exposure',
  imports: [CommonModule],
  templateUrl: './star-exposure.component.html',
  styleUrls: ['./star-exposure.component.scss']
})
export class StarExposureComponent {
  @ViewChild('warpCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() scale: number = 1;
  @Input() targetOffset: number = 0;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private centerX: number = this.width / 2;
  private centerY: number = this.height / 2;
  private animationFrameId!: number;

  // Animation state
  private offset: number = 0;
  
  // CONFIGURABLE: number of stars scales with window width.
  private readonly STARS_COUNT: number = window.innerWidth;
  private readonly SMOOTHING_FACTOR: number = 0.1; // adjust for smoothness
  private readonly STAR_SIZE_RANGE: [number, number] = [0.8, 1.5];

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.initializeStars();
    this.smoothUpdate();
    this.draw();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initializeStars(): void {
    this.stars = Array.from({ length: this.STARS_COUNT }, () => this.createStar());
  }
  
  private createStar(): Star {
    const angle = Math.random() * Math.PI * 2;
    const maxRadius = Math.sqrt(this.width ** 2 + this.height ** 2) / 2; // Pythagore diagonal length
    
    // Set a random radius within a homogeneous but better-distributed range
    const minRadius = 0; // Minimum radius as a fraction of the max diagonal
    const rawRandom = Math.random();  // [0, 1]
    
    // Apply a power function to skew the distribution toward larger values
    const radius = Math.pow(rawRandom, 0.6) * (maxRadius - minRadius) + minRadius; // More skewed to larger values
    
    // Calculate size based on the defined range
    const size = Math.random() * (this.STAR_SIZE_RANGE[1] - this.STAR_SIZE_RANGE[0]) + this.STAR_SIZE_RANGE[0];
  
    return {
      angle,
      endAngle: angle,
      radius, // Skewed random radius
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      size,
    };
  }

  // Smoothly updates the current offset toward the targetOffset.
  private smoothUpdate(): void {
    this.offset += (this.targetOffset - this.offset) * this.SMOOTHING_FACTOR;
  };

  // Main drawing loop.
  private draw = (): void => {
    this.clearCanvas();

    this.smoothUpdate();

    for (const star of this.stars) {
      this.updateStar(star);
      this.drawStar(star);
      this.drawExposureArc(star);
    }

    this.animationFrameId = requestAnimationFrame(this.draw);
  };

  private clearCanvas(): void {
    // Use composite operations to clear the canvas.
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private updateStar(star: Star): void {
    star.endAngle = star.angle + (this.offset * 0.001);
  }

  private drawStar(star: Star): void {
    const x = this.centerX + Math.cos(star.angle) * star.radius;
    const y = this.centerY + Math.sin(star.angle) * star.radius;

    this.ctx.fillStyle = star.color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawExposureArc(star: Star): void {
    this.ctx.beginPath();
    this.ctx.arc(
      this.centerX,
      this.centerY,
      star.radius,
      star.angle,
      star.endAngle,
      star.angle > star.endAngle
    );
    this.ctx.strokeStyle = star.color;
    this.ctx.lineWidth = star.size * 2;
    this.ctx.stroke();
  }
}