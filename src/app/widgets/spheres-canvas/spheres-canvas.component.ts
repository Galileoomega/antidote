import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spheres-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spheres-canvas.component.html',
  styleUrls: ['./spheres-canvas.component.scss']
})
export class SpheresCanvasComponent implements OnInit, OnChanges {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() animPercentage: number = 0;
  
  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private readonly CANVAS_SIZE = 400;
  private centerX: number = 0;
  private centerY: number = 0;
  private radius: number = 0;

  ngOnInit(): void {
    // Wait for the view to be initialized
    setTimeout(() => {
      this.initCanvas();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animPercentage'] && this.ctx) {
      this.drawSpheres();
    }
  }

  private initCanvas(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true })!;
    
    // Set canvas size to fixed dimensions
    this.canvas.width = this.CANVAS_SIZE;
    this.canvas.height = this.CANVAS_SIZE;

    // Center coordinates
    this.centerX = this.CANVAS_SIZE / 2;
    this.centerY = this.CANVAS_SIZE / 2;
    this.radius = this.CANVAS_SIZE / 2;

    // Set blur filter
    this.ctx.filter = 'blur(10px)';

    // Draw spheres
    this.drawSpheres();
  }

  private drawSpheres(): void {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);

    // First sphere (black)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fill();
    this.ctx.closePath();

    // Second sphere (primary color)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 123, 255, 0.9)'; // Primary color with transparency
    this.ctx.fill();
    this.ctx.closePath();

    // Third sphere (secondary color)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 117, 125, 0.9)'; // Secondary color with transparency
    this.ctx.fill();
    this.ctx.closePath();

    // Fourth sphere (linear gradient)
    const gradient = this.ctx.createLinearGradient(
      this.centerX, this.centerY - this.radius,  // Start from top of sphere
      this.centerX, this.centerY + this.radius   // End at bottom of sphere
    );
    
    // Interpolate the black color stop based on animation percentage
    const blackStop = this.interpolate(1, 0, this.animPercentage);
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(blackStop, `rgba(0, 0, 0, 1)`);

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * (progress / 100);
  }
}
