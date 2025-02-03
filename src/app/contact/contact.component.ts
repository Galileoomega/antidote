import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @ViewChild('warpCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private width!: number;
  private height!: number;
  private animationFrameId!: number;
  private speed = 5; // Speed of stars

  ngOnInit(): void {
    this.initStars();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animate();
  }

  private resizeCanvas(): void {
    this.width = this.canvasRef.nativeElement.width = window.innerWidth;
    this.height = this.canvasRef.nativeElement.height = window.innerHeight;
    this.initStars();
  }

  private initStars(): void {
    this.stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * this.width - this.width / 2,
      y: Math.random() * this.height - this.height / 2,
      z: Math.random() * this.width,
      prevZ: 0,
      text: 'Hello'
    }));
  }

  private animate(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.stars.forEach(star => {
      star.prevZ = star.z;
      star.z -= this.speed;
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
      const lineWidth = Math.max(1, 3 * (1 - star.z / this.width));
      
      // Interpolate color from blue (near) to red (far)
      const colorValue = Math.floor(255 * (1 - star.z / this.width));
      this.ctx.strokeStyle = `rgb(${colorValue}, 0, ${255 - colorValue})`;
      this.ctx.lineWidth = lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();

      // Draw text near each star
      this.ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
      this.ctx.font = '14px Arial';
      this.ctx.fillText(star.text, sx, sy - 10);
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
