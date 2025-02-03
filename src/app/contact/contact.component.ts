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
  private speed = 10; // Speed of stars
  private devicePixelRatio = window.devicePixelRatio || 1;

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
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
    this.initStars();
  }

  private initStars(): void {
    this.stars = Array.from({ length: 300 }, (_, i) => ({
      x: Math.random() * this.width - this.width / 2,
      y: Math.random() * this.height - this.height / 2,
      z: Math.random() * this.width,
      prevZ: 0,
      text: i < 10 ? `Star ${i + 1}` : null // Only assign text to 10 stars
    }));
  }

  private animate(): void {
    this.ctx.fillStyle = 'black';
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
      const lineLength = 2; // Increase length as they get closer
      
      // Compute direction vector
      const dx = sx - px;
      const dy = sy - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / distance;
      const uy = dy / distance;
      const ex = sx + ux * lineLength;
      const ey = sy + uy * lineLength;
      
      // Interpolate color from blue (near) to red (far)
      const colorValue = Math.floor(255 * (1 - star.z / this.width));
      this.ctx.strokeStyle = `rgb(${colorValue}, 0, ${255 - colorValue})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
      
      // Draw text following only selected stars
      if (star.text) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${8 * this.devicePixelRatio}px JetBrains-ExtraLight`;
        this.ctx.fillText(star.text, sx + 5, sy - 5);
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
