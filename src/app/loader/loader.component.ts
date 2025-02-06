import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  particles: Particle[] = [];
  arcRadius = 200; // Radius of the spherical arc
  numParticles = 1000; // Number of particles on the arc
  centerX = 400; // Center of the canvas
  centerY = 400;
  cameraZ = 3000; // Camera "depth" for perspective
  arcAngle = 2* Math.PI; // Angle in radians (PI for half-circle, 2PI for full circle)

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.generateParticlesOnArc();
    this.animateParticles();
  }

  generateParticlesOnArc() {
    const step = this.arcAngle / this.numParticles; // Angular step to place particles evenly

    // Generate particles along a spherical arc
    for (let i = 0; i < this.numParticles; i++) {
      // Angular position along the arc
      const angle = i * step - this.arcAngle / 2;

      // Spherical coordinates to Cartesian coordinates
      const x = this.arcRadius * Math.cos(angle);
      const y = this.arcRadius * Math.sin(angle);
      const z = Math.random() * this.arcRadius - this.arcRadius / 2; // Random depth along Z axis

      // Add the particle to the array
      this.particles.push({ x, y, z });
    }
  }

  animateParticles() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    this.particles.forEach(particle => {
      // Perspective Transformation
      const scale = this.cameraZ / (this.cameraZ + particle.z);
      const x2D = this.centerX + particle.x * scale;
      const y2D = this.centerY + particle.y * scale;

      // Draw the particle with a fixed size for sharper edges
      this.ctx.beginPath();
      this.ctx.arc(x2D, y2D, 3, 0, Math.PI * 2); // Larger size for sharper particles
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animateParticles());
  }
}