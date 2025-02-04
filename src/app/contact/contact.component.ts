import { Component, ElementRef, ViewChild } from '@angular/core';
import { finalize, interval, take } from 'rxjs';

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
  private devicePixelRatio = window.devicePixelRatio || 1;
  public currentSpeed = 0.01;
  private displayText: boolean = false;
  
  private targetSpeed: number = 6;
  private starsCount: number = 400;
  private textCount: number = 10;
  private ctxFill = 'rgba(0, 0, 0, 0)';

  ngOnInit(): void {
    this.initStars();
    this.animateText(this.texts)
    const interval = setInterval(() => {
      this.animateText(['hello@dev.com'], 4);
      clearInterval(interval)
    }, 1000)
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.smoothSpeedIncrease();
  }

  texts: string[] = ["LET'S", "GET", "IN", "TOUCH"];
  displayTexts: string[] = []; // Holds animated text
  characters = "abcdefghijklmnopqrstuvwxyz0123456789!?@#$%&*.><:;=";

  animateText(texts: string[], index: number | null = null) {
    this.displayTexts = texts.map(word => "#".repeat(word.length)); // Start with masked words

    texts.forEach((word, wordIndex) => {
      let textArray = word.split("");
      let randomTextArray = Array(word.length).fill("#");

      interval(150) // Emits every 150ms
        .pipe(
          take(textArray.length + 5),
          finalize(() => {
            
          })
        ) // Stops after revealing the full word
        .subscribe((tick) => {
          if (tick < textArray.length) {
            randomTextArray[tick] = textArray[tick]; // Reveal correct character
          }

          // Replace remaining characters with random ones
          for (let i = tick + 1; i < textArray.length; i++) {
            randomTextArray[i] = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
          }

          wordIndex = index==null ? wordIndex : index
          this.displayTexts[wordIndex] = randomTextArray.join("");
        })
    });
  }

  private smoothSpeedIncrease(): void {
    let highestSpeed = this.targetSpeed * 10;
    let step = 0.2;
    let ascending = true;

    const speedInterval = setInterval(() => {
      if (this.currentSpeed < highestSpeed && ascending) {
        this.currentSpeed += step;
      } else if (this.currentSpeed > this.targetSpeed) {
        this.ctxFill = 'rgba(0, 0, 0, 1)'
        ascending = false
        this.currentSpeed -= step;
      } else {
        this.currentSpeed = this.targetSpeed;
        clearInterval(speedInterval);
        this.displayText = true;
      }
    }, 5);

    this.animate();
  }

  private *starSystemGenerator() {
    const prefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Omicron", "Sigma", "Omega"];
    const suffixes = ["Centauri", "Eridani", "Ceti", "Luyten", "Proxima", "Wolf", "Gliese", "Kepler", "TRAPPIST", "Andromeda"];
    while (true) {
      yield `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
  }
  private starSystemGen = this.starSystemGenerator();

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
    let textStarCount = 0;
    this.stars = Array.from({ length: this.starsCount }, () => {
      const x = Math.random() * this.width - this.width / 2;
      const y = Math.random() * this.height - this.height / 2;
      const z = Math.random() * this.width;

      const text = textStarCount < this.textCount ? this.starSystemGen.next().value : null;

      textStarCount++

      return { x, y, z, prevZ: 0, text };
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
      const lineLength = 2;
      
      // Compute direction vector
      const dx = sx - px;
      const dy = sy - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / distance;
      const uy = dy / distance;
      const ex = sx + ux * lineLength;
      const ey = sy + uy * lineLength;
      
      const colorValue = Math.floor(255 * (1.1 - star.z / this.width));
      const rgbMix = `rgb(${colorValue}, ${colorValue}, ${colorValue})`
      this.ctx.strokeStyle = rgbMix;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();
      
      // Draw text following only selected stars
      if (star.text && this.displayText) {
        this.ctx.fillStyle = rgbMix;
        this.ctx.font = `${8 * this.devicePixelRatio}px JetBrains-ExtraLight`;
        this.ctx.fillText(star.text, sx + 15, sy + 4);
        
        // Draw square around star
        this.ctx.strokeStyle = '#343434';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(sx - 7, sy - 7, 14, 14);
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
