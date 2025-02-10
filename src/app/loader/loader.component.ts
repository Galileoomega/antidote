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
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  particles: Particle[] = [];
  arcRadius = 200; // Radius of the spherical arc
  numParticles = 500; // Number of particles on the arc
  centerX = window.innerWidth / 2; // Center of the canvas
  centerY = window.innerHeight / 2;
  cameraZ = 100; // Camera "depth" for perspective
  targetCameraZ = 100; // Target camera depth for transition
  transitionDuration = 10000; // Transition duration in milliseconds
  transitionStartTime: number | null = null;

  arcAngle = 2 * Math.PI; // Angle in radians (PI for half-circle, 2PI for full circle)

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d')!;
    this.generateParticlesOnArc();
    this.animateParticles();

    const interval = setInterval(() => {
      this.transitionCamera(2000)
    }, 1000)
  }

  generateParticlesOnArc() {
    const step = this.arcAngle / this.numParticles; // Angular step to place particles evenly

    // Generate particles along a spherical arc
    for (let i = 0; i < this.numParticles; i++) {
      const angle = i * step - this.arcAngle / 2;

      const x = this.arcRadius * Math.cos(angle);
      const y = this.arcRadius * Math.sin(angle);
      const z = Math.random() * this.arcRadius - this.arcRadius / 2;

      this.particles.push({ x, y, z });
    }
  }

  animateParticles() {
    const currentTime = Date.now();

    // Smoothly transition the cameraZ value
    if (this.transitionStartTime !== null) {
      const elapsedTime = currentTime - this.transitionStartTime;
      if (elapsedTime < this.transitionDuration) {
        const progress = elapsedTime / this.transitionDuration;
        this.cameraZ = this.cameraZ + (this.targetCameraZ - this.cameraZ) * progress;
      } else {
        this.cameraZ = this.targetCameraZ;
        this.transitionStartTime = null; // Reset after transition is complete
      }
    }

    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    this.particles.forEach(particle => {
      const scale = this.cameraZ / (this.cameraZ + particle.z);
      const x2D = this.centerX + particle.x * scale;
      const y2D = this.centerY + particle.y * scale;

      this.ctx.beginPath();
      this.ctx.arc(x2D, y2D, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.64)';
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animateParticles());
  }

  // Call this method to trigger the camera transition to a new depth
  transitionCamera(newDepth: number) {
    this.targetCameraZ = newDepth;
    this.transitionStartTime = Date.now();
  }
}
